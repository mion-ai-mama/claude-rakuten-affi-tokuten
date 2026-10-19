/**
 * script.js — content.js の内容からページを組み立てる（通常は編集不要）
 */
(function () {
  "use strict";

  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const list = (items, cls) => (items && items.length ? `<ul class="${cls}">${items.map((i) => `<li>${i}</li>`).join("")}</ul>` : "");
  const ext = (url, text, cls) => `<a class="btn ${cls || ""}" href="${esc(url)}" target="_blank" rel="noopener">${text}</a>`;
  const textLink = (url, text) => `<a class="text-link" href="${esc(url)}" target="_blank" rel="noopener">${text}</a>`;
  const badge = (label) => `<span class="badge badge--${label === "発展編" ? "adv" : "basic"}">${label}</span>`;

  function setMeta(selector, value) {
    const el = document.querySelector(selector);
    if (el && value != null) el.setAttribute("content", value);
  }

  function applyMeta(m) {
    document.title = m.pageTitle;
    setMeta('meta[name="description"]', m.description);
    setMeta('meta[property="og:title"]', m.pageTitle);
    setMeta('meta[property="og:description"]', m.description);
    setMeta('meta[property="og:url"]', m.siteUrl);
  }

  function hero(h) {
    const avatar = h.avatar
      ? `<div class="hero__author"><img class="hero__avatar" src="${esc(h.avatar.src)}" alt="${esc(h.avatar.alt)}" width="56" height="56"><span class="hero__name">${h.avatar.name}</span></div>`
      : "";
    return `
    <section class="hero" aria-labelledby="hero-title">
      <div class="container">
        <p class="hero__brand">${h.brand}</p>
        <h1 class="hero__title" id="hero-title">${h.titleLines.join("<br>")}</h1>
        <p class="hero__sub">${h.subtitle}</p>
        <div class="hero__lead">${h.lead.map((p) => `<p>${p}</p>`).join("")}</div>
        ${avatar}
        <a class="btn btn--ghost" href="#${esc(h.buttonTarget)}" data-scroll>${h.buttonText}</a>
      </div>
    </section>`;
  }

  function topCta(c, url) {
    const image = `<a class="cta-soft__image" href="${esc(url)}" target="_blank" rel="noopener"><img src="${esc(c.image.src)}" alt="${esc(c.image.alt)}" width="1855" height="848"></a>`;
    return `
    <section class="container top-cta" aria-labelledby="top-cta-title">
      <div class="cta-soft">
        ${image}
        <div class="cta-soft__text">
          <h2 class="cta-soft__title" id="top-cta-title">${c.heading}</h2>
          <p>${c.text}</p>
          <ul class="cta-soft__list">${c.items.map((i) => `<li>${i}</li>`).join("")}</ul>
        </div>
        ${ext(url, c.buttonText)}
      </div>
    </section>`;
  }

  function flowColumn(col, cls) {
    const b = col.badge ? badge(col.badge) : "";
    const steps = col.steps.map((s, i) => `<li><span class="flow__no">${i + 1}</span>${s}</li>`).join("");
    return `<div class="flow__col ${cls}"><p class="flow__label">${col.label} ${b}</p><ol class="flow__list">${steps}</ol></div>`;
  }

  function flow(f) {
    return `
    <section class="section section--soft" id="flow" aria-labelledby="flow-title">
      <div class="container">
        <h2 class="heading" id="flow-title">${f.heading}</h2>
        <p>${f.lead}</p>
        <div class="flow">${flowColumn(f.before, "flow__col--before")}${flowColumn(f.after, "flow__col--after")}</div>
        <div class="split">
          <div class="split__item split__item--basic">${badge(f.split.basic.label)}<p>${f.split.basic.text}</p></div>
          <div class="split__item split__item--adv">${badge(f.split.advanced.label)}<p>${f.split.advanced.text}</p></div>
        </div>
      </div>
    </section>`;
  }

  function prepare(p) {
    const cards = p.items
      .map(
        (it) => `
        <article class="card">
          <p class="card__no" aria-hidden="true">${it.no}</p>
          <h3 class="card__title">${it.name}</h3>
          <p><strong>役割：</strong>${it.role}</p>
          <p><strong>費用の目安：</strong>${it.cost}</p>
          <p class="card__links">${textLink(it.url, it.linkText + " ↗")}${it.sub ? `<br>${textLink(it.sub.url, it.sub.text + " ↗")}` : ""}</p>
        </article>`
      )
      .join("");
    return `
    <section class="section" aria-labelledby="prepare-title">
      <div class="container">
        <h2 class="heading" id="prepare-title">${p.heading}</h2>
        <p>${p.lead}</p>
        <div class="cards">${cards}</div>
        <aside class="point-box"><p class="point-box__label">${p.extra.label}</p><p>${p.extra.text}${textLink(p.extra.url, p.extra.linkText + " ↗")}</p></aside>
        <aside class="point-box"><p>${p.note}</p></aside>
      </div>
    </section>`;
  }

  function block(b, id) {
    switch (b.type) {
      case "text":
        return `<div><h3 class="sub-heading">${b.heading}</h3>${b.paragraphs.map((p) => `<p>${p}</p>`).join("")}</div>`;
      case "ordered": {
        const btn = (b.buttons || []).map((x) => ext(x.url, x.text + " ↗", "btn--outline")).join("");
        return `<div><h3 class="sub-heading">${b.heading}</h3><ol class="num-list">${b.items.map((i) => `<li>${i}</li>`).join("")}</ol>${btn ? `<p class="btn-row">${btn}</p>` : ""}</div>`;
      }
      case "point":
        return `<aside class="point-box"><p class="point-box__label">${b.label}</p><p>${b.text}</p>${list(b.list, "point-box__list")}</aside>`;
      case "caution":
        return `<aside class="point-box point-box--caution"><p class="point-box__label">${b.label}</p><p>${b.text}</p></aside>`;
      case "prompt":
        return `
        <div class="prompt">
          <p class="prompt__label">${b.label}</p>
          <pre class="prompt__text" id="${id}">${esc(b.text)}</pre>
          <button type="button" class="btn btn--outline copy-btn" data-copy-target="${id}">
            <span class="copy-btn__label">${b.buttonText}</span>
            <span class="copy-btn__done" role="status" aria-live="polite">${b.copiedText}</span>
          </button>
        </div>`;
      default:
        return "";
    }
  }

  function step(s) {
    const body = s.blocks.map((b, i) => block(b, `${s.id}-prompt-${i}`)).join("");
    const src = s.source ? `<p class="source">${textLink(s.source.url, s.source.text + " ↗")}</p>` : "";
    return `
    <section class="step" id="${s.id}" aria-labelledby="${s.id}-title">
      <div class="container">
        <article class="step-card">
          <header class="step__head">
            <p class="step__no" aria-hidden="true"><span>STEP</span>${s.number}</p>
            <div>
              <p class="step__badge">${badge("基本編")}</p>
              <h2 class="step__title" id="${s.id}-title"><span class="visually-hidden">STEP ${s.number}　</span>${s.title}</h2>
              <p class="step__lead">${s.lead}</p>
            </div>
          </header>
          <div class="step__body">${body}${src}</div>
        </article>
      </div>
    </section>`;
  }

  function level(l) {
    const adv = l.tag === "発展編";
    const done = l.done ? `<p class="level__done">${l.done}</p>` : "";
    const text = l.text ? `<p>${l.text}</p>` : "";
    const itemsLabel = l.itemsLabel ? `<p class="level__items-label">${l.itemsLabel}</p>` : "";
    const note = l.note ? `<p class="level__note">${l.note}</p>` : "";
    const link = l.url ? `<p>${textLink(l.url, l.linkText + " ↗")}</p>` : "";
    return `
      <article class="level ${adv ? "level--adv" : "level--basic"}">
        <p class="level__head"><span class="level__no">${l.level}</span>${badge(l.tag)}</p>
        <h3 class="level__title">${l.title}</h3>
        ${done}${text}${itemsLabel}${list(l.items, "check-list")}${note}${link}
      </article>`;
  }

  function advanced(a) {
    return `
    <section class="section section--adv" id="advanced" aria-labelledby="adv-title">
      <div class="container">
        <p class="adv-label">${badge("発展編")}</p>
        <h2 class="heading" id="adv-title">${a.heading}</h2>
        <p>${a.lead}</p>
        <div class="levels">${a.levels.map(level).join("")}</div>
        <p class="closing">${a.closing}</p>
      </div>
    </section>`;
  }

  function cautions(c) {
    const links = c.links.map((l) => textLink(l.url, l.text + " ↗")).join("<br>");
    return `
    <section class="section" aria-labelledby="caution-title">
      <div class="container">
        <h2 class="heading" id="caution-title">${c.heading}</h2>
        ${list(c.items, "check-list")}
        <p class="source">${links}</p>
      </div>
    </section>`;
  }

  function finalCta(c, t, url) {
    return `
    <section class="section section--soft" aria-labelledby="final-cta-title">
      <div class="container">
        <div class="cta-final">
          <h2 class="cta-final__title" id="final-cta-title">${c.heading}</h2>
          ${c.paragraphs.map((x) => `<p>${x}</p>`).join("")}
          <div class="cta-final__who"><p class="cta-final__who-label">${c.listLabel}</p>${list(c.list, "check-list")}</div>
          ${c.closingParagraphs.map((x) => `<p>${x}</p>`).join("")}
          ${ext(url, c.buttonText, "btn--large")}
        </div>
        <div class="textbook">
          <p>${t.bridge}</p>
          <a class="textbook__banner" href="${esc(url)}" target="_blank" rel="noopener">
            <img src="${esc(t.banner)}" alt="${esc(t.bannerAlt)}" loading="lazy">
          </a>
          <p>${t.support}</p>
        </div>
      </div>
    </section>`;
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(() => true, () => false);
    }
    return Promise.resolve(false);
  }

  function bind() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".copy-btn[data-copy-target]");
      if (btn) {
        const target = document.getElementById(btn.dataset.copyTarget);
        copyText(target.textContent).then((ok) => {
          if (!ok) return;
          btn.classList.add("is-copied");
          clearTimeout(btn._t);
          btn._t = setTimeout(() => btn.classList.remove("is-copied"), 2200);
        });
        return;
      }
      const link = e.target.closest("a[data-scroll]");
      if (link) {
        const dest = document.querySelector(link.getAttribute("href"));
        if (dest) {
          e.preventDefault();
          dest.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
        }
      }
    });
  }

  function init() {
    const main = document.getElementById("main");
    if (typeof CONTENT === "undefined") return;
    const c = CONTENT;
    applyMeta(c.meta);
    main.innerHTML =
      hero(c.hero) +
      topCta(c.topCta, c.lineUrl) +
      flow(c.flow) +
      prepare(c.prepare) +
      `<div class="basic-zone">${c.steps.map(step).join("")}</div>` +
      advanced(c.advanced) +
      cautions(c.cautions) +
      finalCta(c.finalCta, c.textbook, c.lineUrl);
    document.getElementById("footer").innerHTML = `<p>${c.footer.copyright}</p><p>${c.footer.notice}</p>`;
    bind();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
