// Function to generate the API URL for fetching video statistics
function getApiUrl(videoId) {
  const apiKey = "AIzaSyBDZfkeWexvVRpt8CXnnm5AdUGxcrGnbGM";
  return (
    "https://www.googleapis.com/youtube/v3/videos?id=" +
    videoId +
    "&key=" +
    apiKey +
    "&part=statistics"
  );
}
let ratio;
// Function to fetch the likes count and add it to the thumbnail
function updateLikes(videoId, thumbnail) {
  // Get the API URL for the given video ID
  const apiUrl = getApiUrl(videoId);
  // Fetch video statistics
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Extract the likes count
      const likes = data.items[0].statistics.likeCount;
      let varlikes = likes;
      const views = data.items[0].statistics.viewCount;
      ratio = (likes / views) * 100;
      ratio = ratio.toFixed(2);
        // Create a new div element to display the likes count
      const likesDiv = document.createElement("div");
      if(likes >= 1000){
        varlikes /= 1000;
        varlikes = varlikes.toFixed(2);
        likesDiv.innerText = `${ratio} % ${varlikes}k`;
      }
      else{
      likesDiv.innerText = `${ratio} % ${likes}`;
      }
      likesDiv.style.position = "absolute";
      likesDiv.style.bottom = "4px";
      likesDiv.style.right = "4px";
      likesDiv.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
      likesDiv.style.color = "white";
      likesDiv.style.padding = "2px 4px";
      likesDiv.style.borderRadius = "2px";
      // Append the likes div to the thumbnail
      thumbnail.appendChild(likesDiv);
    });
}

// Function to extract the video ID from a YouTube video URL
function getVideoIdFromUrl(url) {
  const regex = /[?&]v=([^&#]*)/;
  const match = regex.exec(url);

  // Check if a match was found
  if (match) {
    return match[1];
  } else {
    // If no match is found, return null or another default value
    return null;
  }
}

// Main function to initialize the extension
function init() {
  // Select all thumbnail containers on the page
  const thumbnails = document.querySelectorAll("ytd-video-renderer, ytd-compact-video-renderer, ytd-rich-item-renderer");

  // Iterate through each thumbnail container
  thumbnails.forEach((thumbnail) => {
    const thumbnailAnchor = thumbnail.querySelector("a#thumbnail");
    if (thumbnailAnchor && !thumbnail.hasAttribute("data-video-id")) {
      // Get the video URL and extract the video ID
      const videoUrl = thumbnailAnchor.getAttribute("href");
      const videoId = getVideoIdFromUrl(videoUrl);

      // If a valid video ID was found, update the thumbnail with the likes count
      if (videoId) {
        thumbnail.setAttribute("data-video-id", videoId);
        updateLikes(videoId, thumbnail);
      }
    }
  });
}

// Create a MutationObserver to detect changes in the page content
const observer = new MutationObserver((mutations) => {
  let shouldInit = false;

  // Check for any childList mutations
  for (const mutation of mutations) {
    if (mutation.type === "childList") {
      shouldInit = true;
      break;
    }
  }

  // If a childList mutation was detected, re-run the init function
  if (shouldInit) {
    init();
  }
});

// Observe the document body for changes
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Run the init function on page load
init();
