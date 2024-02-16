"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  evt.preventDefault();
  hidePageComponents();
  putStoriesOnPage();

}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  evt.preventDefault();
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $(".nav-left").show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

$('#nav-submit').on('click', showSubmitForm);


/** When a user clicks on submit link, submit new story form appears*/

function showSubmitForm(evt) {

  navAllStories(evt);

  $("#submit-form").show();

}


$('#nav-favorites').on('click', showFavoritesList);

/** When a user clicks on favorites link a list of favorite stories loads */

function showFavoritesList() {

  const favorites = currentUser.favorites;
  $favoriteStoriesList.empty();
  // loop through all of our stories and generate HTML for them

  for (let story of favorites) {
    const $story = generateStoryMarkup(story);
    $favoriteStoriesList.prepend($story);

  }

  $submitForm.hide();
  $allStoriesList.hide();
  $favoriteStoriesList.show();
}