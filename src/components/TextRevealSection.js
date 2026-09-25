import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './TextRevealSection.css';

const Word = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <motion.span style={{ opacity }}>
      {children}
    </motion.span>
  );
};

function TextRevealSection({ text, blackFont=false }) {
  const ref = useRef(null);
  const LINE_BREAK_PLACEHOLDER = "__LINE_BREAK__";
  const ANCHOR_PLACEHOLDER_PREFIX = "__ANCHOR_";
  const ANCHOR_PLACEHOLDER_SUFFIX = "__";

  let anchorTags = [];
  let processedText = text.replace(/<a\s+(?:[^>]*?\s+)?href=(?:["'])(.*?)(?:["'])>(.*?)<\/a>/g, (match, href, linkText, offset) => {
    const placeholder = `${ANCHOR_PLACEHOLDER_PREFIX}${anchorTags.length}${ANCHOR_PLACEHOLDER_SUFFIX}`;
    anchorTags.push({ placeholder, href, linkText });
    return placeholder;
  });

  processedText = processedText.replace(/\n/g, ` ${LINE_BREAK_PLACEHOLDER} `);
  const words = processedText.split(" ").filter(Boolean);
  const REVEAL_FACTOR = 0.65; // Adjust this value to control reveal speed (0.1 to 1.0)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const blackFontCls = blackFont ? 'black-font background-white' : ''
  return (
    <section ref={ref}  className={`text-reveal-section ${blackFontCls}`}>
      <p className={`text-reveal-text ${blackFontCls}`}>
        {words.map((word, i) => {
          if (word === LINE_BREAK_PLACEHOLDER) {
            return <br key={i} />;
          } else if (word.startsWith(ANCHOR_PLACEHOLDER_PREFIX) && word.endsWith(ANCHOR_PLACEHOLDER_SUFFIX)) {
            const anchorIndex = parseInt(word.replace(ANCHOR_PLACEHOLDER_PREFIX, '').replace(ANCHOR_PLACEHOLDER_SUFFIX, ''));
            const anchor = anchorTags[anchorIndex];
            return (
              <a key={i} href={anchor.href} target="_blank" rel="noopener noreferrer">
                {anchor.linkText}
              </a>
            );
          }
          const start = (i / words.length) * REVEAL_FACTOR;
          const end = ((i + 1) / words.length) * REVEAL_FACTOR;
          return (
            <Word key={word + i} progress={scrollYProgress} range={[start, end]}>
              {word}{" "}
            </Word>
          );
        })}
      </p>
    </section>
  )};

export default TextRevealSection;
