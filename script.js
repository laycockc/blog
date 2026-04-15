/**
 * Console UI: tabs, clipboard copy, favorites toggle, jump to main.
 * Degrades gracefully if APIs are unavailable.
 */

(function () {
  "use strict";

  /* ── Jump to main (search affordance) ── */
  const searchJump = document.getElementById("search-jump");
  const mainContent = document.getElementById("main-content");

  if (searchJump && mainContent) {
    searchJump.addEventListener("click", function () {
      mainContent.focus({ preventScroll: false });
      mainContent.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* ── Tabs (WAI-ARIA tab pattern) ── */
  const tablist = document.querySelector('[role="tablist"]');
  const tabs = tablist ? Array.from(tablist.querySelectorAll('[role="tab"]')) : [];
  const panels = tabs
    .map(function (tab) {
      const id = tab.getAttribute("aria-controls");
      return id ? document.getElementById(id) : null;
    })
    .filter(Boolean);

  function applyTabSelection(index, moveFocus) {
    if (index < 0 || index >= tabs.length) return;

    tabs.forEach(function (tab, i) {
      const selected = i === index;
      tab.setAttribute("aria-selected", selected ? "true" : "false");
      tab.tabIndex = selected ? 0 : -1;
      const panel = panels[i];
      if (panel) {
        if (selected) {
          panel.removeAttribute("hidden");
        } else {
          panel.setAttribute("hidden", "");
        }
      }
    });

    if (moveFocus) {
      tabs[index].focus();
    }
  }

  if (tabs.length && panels.length === tabs.length) {
    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        applyTabSelection(index, true);
      });

      tab.addEventListener("keydown", function (e) {
        let next = index;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          next = (index + 1) % tabs.length;
          applyTabSelection(next, true);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          next = (index - 1 + tabs.length) % tabs.length;
          applyTabSelection(next, true);
        } else if (e.key === "Home") {
          e.preventDefault();
          applyTabSelection(0, true);
        } else if (e.key === "End") {
          e.preventDefault();
          applyTabSelection(tabs.length - 1, true);
        }
      });
    });
  }

  /* ── Copy to clipboard ── */
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  document.querySelectorAll(".copy-btn[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const text = btn.getAttribute("data-copy");
      if (!text) return;

      copyText(text)
        .then(function () {
          btn.classList.add("copied");
          window.setTimeout(function () {
            btn.classList.remove("copied");
          }, 1200);
        })
        .catch(function () {
          btn.setAttribute("title", "Copy failed — select text manually");
        });
    });
  });

  /* ── Favorite toggle ── */
  const fav = document.getElementById("fav");
  if (fav) {
    fav.addEventListener("click", function () {
      const isStarred = fav.textContent === "★";
      fav.textContent = isStarred ? "☆" : "★";
      fav.setAttribute("aria-pressed", isStarred ? "false" : "true");
      fav.style.color = isStarred ? "" : "var(--orange)";
    });
  }
})();
