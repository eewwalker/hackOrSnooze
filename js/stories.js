"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  const inFavorites = checkForStoryInFavorites(story);
  const starStyle = inFavorites ? 'bi-star-fill' : 'bi-star';
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <span class="star">
          <i class="bi ${starStyle}">
          </i>
        </span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

$("#submit-form").on('click', 'button', submitNewStory);

/** Getting information from submit form and using values to create new story on the page */
async function submitNewStory(evt) {
  evt.preventDefault();

  const author = $("#form-author").val();
  const title = $("#form-title").val();
  const url = $("#form-url").val();

  const newStory = await storyList.addStory(currentUser, {
    author,
    title,
    url
  });
  const newStoryMarkup = generateStoryMarkup(newStory);
  $allStoriesList.prepend(newStoryMarkup);
  $('#submit-form').hide();

}

$allStoriesList.on("click", ".star", updateFavorites);

async function updateFavorites(evt) {
  const $icon = $(evt.target);
  const storyId = $icon
    .closest("li")
    .attr("id");
  const story = await Story.getStory(storyId);

  if (checkForStoryInFavorites(story)) {
    currentUser.removeFavorite(story);
    $icon.attr("class", "bi bi-star");
  } else {
    currentUser.addFavorite(story);
    $icon.attr("class", "bi bi-star-fill");
  }


}

function checkForStoryInFavorites(story) {
  for (let favoriteStory of currentUser.favorites) {
    if (story.storyId === favoriteStory.storyId) {
      return true;
    }
  }
  return false;
}