
npm install
npm start

We have public folder where every content mp4/webm is present.

You need to create a folder for new content in public and add content there

If I were to add a new project say mirror, I'd create a new folder 
public/mirror and add mirror.mp4 and 5 webp files which are the frames of the project

Next, I also need to add it to content folder. So I'll add mirror.mp4 and mirror.webp to content folder.

Next, I'll need to update the data. 
src/data/projects.js contains all the projects.

homeProjects => stuff to display on home
extraWork => homeProjects + extra portfolio stuff
Example project addition:
 {
    title: 'Jainson Locks',
    slug: 'jainson-locks',
    category: 'Assistant Director/Editor',
    videoSrc: '/content/jainson',
    hasBlob: false,
    isVertical: false,
    description: `Jainson Locks wanted a series of short ad films with a slice-of-life tone — light, funny, and insight-driven. Our team pitched a few quirky ideas rooted in everyday moments, and I was brought on board early in the process.\n\nAs Assistant Director, I worked closely with the writer and director to coordinate pre-production, helped develop the visual tone through moodboarding, and kept the shoot running smoothly. After production, I took over the edit — from selecting key footage and refining timing to designing sound for comic beats. A sharp, simple film with clean execution.`
  },

  Title is project specific title to render on project page
  slug is url
  category is what to render on card
  videoSrc is source of the video to show
  hasBlob is irrelevant
  isVertical is to indicate if video is vertical or not
  description in description to enter

Add the new project there

Ordering matters so reshuffle if you want certain projects to come up first

Make sure that all the vertical videos that are added are divisible by 1 otherwise there'll be empty space because we render 2 videos per row

Make sure the videos and images you add are compressed otherwise they'll take too much time to load

No need to touch any code files

Helpful ffmpeg commands:
compress video
ffmpeg -i podcast.mp4 -vcodec libx264 -crf 32 -preset fast -c:a aac -b:a 128k podcast_1.mp4

extract frames from video, we only use 5 frames in project specific page
for loop goes till 5, i * 5, extract every 5th frame, change 5 to 10 or anything to extract ith frame

run in this in public/project folder once you have video there

example: extract 5 frames every 10 seconds fro accha-tiffin video in the public/accha-tiffin video
for i in 1 2 3 4 5; do
  ts=$((i * 10))
  ffmpeg -ss "$ts" -i accha-tiffin.mp4 -frames:v 1 "${i}.webp"
done


# anishP
