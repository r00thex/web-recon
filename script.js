// Tab view
let history = JSON.parse(localStorage.getItem("history")) || [];
let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
const urlInput = document.getElementById("urlBar").value.trim();
const bookmarkIcon = document.getElementById("bookmark-icon");


// Create webview
const webview = document.createElement("webview");
webview.src = "https://google.com";
webview.id = "webview-activeTab";
//webview.setAttribute("allowpopups", "true");
webview.setAttribute("webpreferences", "nativeWindowOpen");
document.getElementById("browser-container").appendChild(webview);

// Window Back
function goBack() {
  if (webview && webview.canGoBack()) webview.goBack();
}

// Window Forward
function goForward() {
  if (webview && webview.canGoForward()) webview.goForward();
}

// Window Reload
function reload() {
  if (webview) webview.reload();
}

// Full Refresh
function forceRefresh() {
  location.reload();
}


// Theme switcher
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
}

window.onload = function () {
  if (localStorage.getItem("darkMode") !== "disabled") {
    document.body.classList.add("dark-mode");
  }
};

// Dev Tool
function openDevTools() {
  if (webview) {
    webview.openDevTools();
  } else {
    alert("No active tab found.");
  }
}

// Bookmark Save
document.addEventListener("DOMContentLoaded", function () {
  function updateBookmarkIcon() {
    const urlInput = urlBar.value.trim();
    if (bookmarks.includes(urlInput)) {
      bookmarkIcon.classList.add("yellow");
    } else {
      bookmarkIcon.classList.remove("yellow");
    }
  }

  urlBar.addEventListener("input", updateBookmarkIcon);

  function saveBookmark() {
    const urlInput = urlBar.value.trim();
    if (!urlInput) return;

    const index = bookmarks.indexOf(urlInput);

    if (index === -1) {
      bookmarks.push(urlInput);
      bookmarkIcon.classList.add("yellow");
    } else {
      bookmarks.splice(index, 1);
      bookmarkIcon.classList.remove("yellow");
    }

    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }

  bookmarkIcon.addEventListener("click", saveBookmark);
  updateBookmarkIcon();
});


// Delete BookMarks & History
function deleteItem(type, index) {
  if (type === 'bookmarks') bookmarks.splice(index, 1);
  if (type === 'history') history.splice(index, 1);
  localStorage.setItem(type, JSON.stringify(type === 'bookmarks' ? bookmarks : history));
  showPopup(type);
}

// Add History
function addToHistory(url) {
  if (!history.includes(url)) {
    history.push(url);
    localStorage.setItem("history", JSON.stringify(history));
  }
}

// Show PopUps
function showPopup(type) {
  const list = type === 'bookmarks' ? bookmarks : history;
  document.getElementById("popup-title").innerText = type === 'bookmarks' ? "Bookmarks" : "History";
  const popupList = document.getElementById("popup-list");
  popupList.innerHTML = "";
  list.forEach((url, index) => {
    const li = document.createElement("li");
    const shortUrl = url.length > 50 ? url.substring(0, 50) + "..." : url;
    li.innerHTML = `${shortUrl} <button class="ui icon button" onclick="deleteItem('${type}', ${index})"><i class="times red icon"></i></button>`;
    popupList.appendChild(li);
  });

  document.getElementById("popup").style.display = "block";
}

// Close Popup
function closePopup() {
  document.getElementById("popup").style.display = "none";
}

// Url bar 
document.getElementById("urlBar").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const urlInput = document.getElementById("urlBar").value.trim();
    const errorTag = document.getElementById("error-log");

    // Validate URL
    if (!isValidURL(urlInput)) {
      errorTag.innerHTML = "<p>Please enter a valid URL!</p>";
      $(".ui.mini.error-modal").modal("show");
      return;
    }

    const formattedUrl = urlInput.startsWith("http") ? urlInput : `https://${urlInput}`;
    // const webview = document.getElementById("webview-" + activeTab);

    if (webview) {
      webview.src = formattedUrl;
      addToHistory(formattedUrl);
    }
  }
});

function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}


// Hackbar Toggle
function hackbar() {
  const view = document.getElementById("hackbar");
  const icon = document.getElementById("toggle-icon");

  if (view.style.display === "none" || view.style.display === "") {
    view.style.display = "block";
    view.style.height = "auto";
    icon.classList.remove("off");
    icon.classList.add("on");
  } else {
    view.style.display = "none";
    icon.classList.remove("on");
    icon.classList.add("off");
  }
}

// update url
document.addEventListener("DOMContentLoaded", () => {
  const webview = document.querySelector("webview");
  const urlField = document.getElementById("urlBar");

  if (webview) {
    //  URL changes 
    webview.addEventListener("did-navigate", () => {
      urlField.value = webview.getURL();
    });

    webview.addEventListener("did-navigate-in-page", () => {
      urlField.value = webview.getURL();
    });

    webview.addEventListener("dom-ready", () => {
      urlField.value = webview.getURL();
    });
  }
});

