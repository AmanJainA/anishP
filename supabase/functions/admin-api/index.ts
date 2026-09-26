import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SCHEMA = "anish-portfolio";
const SERVICE_KEY = (() => {
  const raw = Deno.env.get("SUPABASE_SECRET_KEYS") || "";
  try {
    const keys = JSON.parse(raw);
    return keys.default || Object.values(keys)[0] || "";
  } catch {
    return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  }
})();
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-admin-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (data:any, status=200) => new Response(JSON.stringify(data), {
  status,
  headers: { ...cors, "Content-Type":"application/json" }
});

async function db(path:string, init:RequestInit={}) {
  if (!SERVICE_KEY) throw new Error("Server database key is not configured");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SERVICE_KEY,
      "Content-Profile": SCHEMA,
      "Accept-Profile": SCHEMA,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let data:any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) throw new Error(data?.message || data?.error || text || `DB error ${res.status}`);
  return data;
}

async function dbCount(path:string) {
  if (!SERVICE_KEY) throw new Error("Server database key is not configured");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method:"GET",
    headers: {
      apikey: SERVICE_KEY,
      "Content-Profile": SCHEMA,
      "Accept-Profile": SCHEMA,
      "Prefer": "count=exact",
      "Range": "0-0",
    },
  });
  const text = await res.text();
  if (!res.ok) {
    let data:any = null;
    try { data = text ? JSON.parse(text) : null; } catch {}
    throw new Error(data?.message || data?.error || text || `DB error ${res.status}`);
  }
  const contentRange = res.headers.get("content-range") || "";
  const match = contentRange.match(/\/([0-9]+)$/);
  return match ? Number(match[1]) : 0;
}

async function sha256(value:string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2,"0")).join("");
}

function tokenFrom(req:Request, body:any) {
  return body?.token || req.headers.get("x-admin-token") || req.headers.get("authorization")?.replace(/^Bearer\s+/i,"") || "";
}

async function requireSession(req:Request, body:any) {
  const token = tokenFrom(req, body);
  if (!token) throw new Error("Unauthorized");
  const hash = await sha256(token);
  const rows = await db(`admin_sessions?select=id,user_id,expires_at,users:users!inner(id,email,role)&token_hash=eq.${encodeURIComponent(hash)}&expires_at=gt.${encodeURIComponent(new Date().toISOString())}&limit=1`);
  if (!rows?.length) throw new Error("Unauthorized");
  return rows[0];
}

const tableFields:any = {
  blog: ["slug","title","content","sort_order"],
  project: ["title","slug","category","video_src","is_external_link","has_blob","show_carousel","is_vertical","description","sort_order"],
  writing: ["external_id","title","url","sort_order"],
};

function cleanPayload(table:string, input:any) {
  const out:any = {};
  for (const k of tableFields[table] || []) if (Object.prototype.hasOwnProperty.call(input,k)) out[k]=input[k];
  return out;
}

Deno.serve(async (req:Request) => {
  if (req.method === "OPTIONS") return new Response("ok",{headers:cors});
  try {
    const body = await req.json().catch(()=>({}));
    const action = body.action;

    if (action === "login") {
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      if (!email || !password) return json({error:"Email and password are required"},400);

      const users = await db(`users?select=id,email,role,password_hash&email=eq.${encodeURIComponent(email)}&limit=1`);
      if (!users?.length || users[0].password_hash !== await sha256(password)) {
        return json({error:"Invalid email or password"},401);
      }

      const tokenBytes = new Uint8Array(32);
      crypto.getRandomValues(tokenBytes);
      const token = Array.from(tokenBytes).map(b=>b.toString(16).padStart(2,"0")).join("");
      const tokenHash = await sha256(token);

      await db("admin_sessions",{
        method:"POST",
        headers:{Prefer:"return=minimal"},
        body:JSON.stringify({
          user_id:users[0].id,
          token_hash:tokenHash,
          expires_at:new Date(Date.now()+1000*60*60*24*7).toISOString()
        })
      });

      return json({token,user:{id:users[0].id,email:users[0].email,role:users[0].role}});
    }

    if (action === "logout") {
      const token = tokenFrom(req,body);
      if (token) await db(`admin_sessions?token_hash=eq.${encodeURIComponent(await sha256(token))}`,{method:"DELETE"});
      return json({ok:true});
    }

    await requireSession(req,body);

    if (action === "list") {
      const table = body.table;
      if (!tableFields[table]) return json({error:"Invalid table"},400);
      return json({rows:await db(`${table}?select=*&order=sort_order.asc,created_at.desc`)});
    }

    if (action === "create") {
      const table=body.table;
      if (!tableFields[table]) return json({error:"Invalid table"},400);
      const rows=await db(table,{
        method:"POST",
        headers:{Prefer:"return=representation"},
        body:JSON.stringify(cleanPayload(table,body.data||{}))
      });
      return json({row:Array.isArray(rows)?rows[0]:rows},201);
    }

    if (action === "update") {
      const table=body.table;
      if (!tableFields[table]) return json({error:"Invalid table"},400);
      const rows=await db(`${table}?id=eq.${encodeURIComponent(String(body.id))}`,{
        method:"PATCH",
        headers:{Prefer:"return=representation"},
        body:JSON.stringify({...cleanPayload(table,body.data||{}),updated_at:new Date().toISOString()})
      });
      return json({row:Array.isArray(rows)?rows[0]:rows});
    }

    if (action === "delete") {
      const table=body.table;
      if (!tableFields[table]) return json({error:"Invalid table"},400);
      await db(`${table}?id=eq.${encodeURIComponent(String(body.id))}`,{method:"DELETE"});
      return json({ok:true});
    }

    if (action === "visits") {
      return json({rows:await db("visits_activity?select=*&order=visited_at.desc")});
    }

    if (action === "visit_stats") {
      const now = new Date();
      const indiaFormatter = new Intl.DateTimeFormat("en-CA", {
        timeZone:"Asia/Kolkata",
        year:"numeric",
        month:"2-digit",
        day:"2-digit"
      });
      const today = indiaFormatter.format(now);
      const start = new Date(`${today}T00:00:00+05:30`);
      const end = new Date(start.getTime()+24*60*60*1000);
      const [total,todayCount] = await Promise.all([
        dbCount("visits_activity?select=id"),
        dbCount(`visits_activity?select=id&visited_at=gte.${encodeURIComponent(start.toISOString())}&visited_at=lt.${encodeURIComponent(end.toISOString())}`)
      ]);
      return json({total,today:todayCount,date:today});
    }

    return json({error:"Unknown action"},400);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return json({error:message}, message==="Unauthorized"?401:500);
  }
});