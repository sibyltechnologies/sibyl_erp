/**
 * SIBYL ERP — Core JS + Theme Engine
 * Applies theme from frappe.boot instantly on load.
 * No flash. No extra HTTP call.
 */

"use strict";

window.sibyl = window.sibyl || {};
sibyl.version = "1.0.0";

// ════════════════════════════════════════════
//  THEME ENGINE — runs FIRST, before DOM ready
//  Injects CSS from frappe.boot immediately
// ════════════════════════════════════════════

sibyl.theme = {
    _styleTag: null,
    _current: null,

    /**
     * Called immediately when script loads.
     * frappe.boot is already available at this point.
     */
    init() {
        if (frappe.boot && frappe.boot.sibyl_theme) {
            this.apply(frappe.boot.sibyl_theme);
        }

        // Listen for theme updates (from builder)
        $(document).on("sibyl:theme:updated", (e, themeData) => {
            this.apply(themeData);
        });
    },

    apply(themeData) {
        if (!themeData) return;
        this._current = themeData;

        // 1. Inject CSS
        if (themeData.css) {
            this._injectCSS(themeData.css);
        }

        // 2. Set app name
        if (themeData.app_name) {
            this._setAppName(themeData.app_name);
        }

        // 3. Set logo
        if (themeData.logo) {
            this._setLogo(themeData.logo, themeData.show_brand_text, themeData.app_name);
        }

        // 4. Set favicon
        if (themeData.favicon) {
            this._setFavicon(themeData.favicon);
        }

        // 5. Apply dark mode preference
        const savedDark = localStorage.getItem("sibyl_dark_mode") === "true";
        if (savedDark && themeData.enable_dark_mode) {
            document.documentElement.setAttribute("data-theme", "dark");
        }

        // 6. Apply module visibility/colors
        if (themeData.module_config) {
            this._applyModuleConfig(themeData.module_config);
        }
    },

    _injectCSS(css) {
        if (!this._styleTag) {
            this._styleTag = document.createElement("style");
            this._styleTag.id = "sibyl-theme-runtime";
            // Insert AFTER all other stylesheets so we win specificity
            document.head.appendChild(this._styleTag);
        }
        this._styleTag.textContent = css;
    },

    _setAppName(name) {
        document.title = name;
        $(".sibyl-brand-text").text(name);
        $(".sibyl-brand").attr("title", name);
        frappe.boot.app_name = name;
    },

    _setLogo(logoUrl, showText, appName) {
        const $logo = $(".sibyl-logo");
        if ($logo.length) {
            $logo.attr("src", logoUrl);
        }
        if (!showText) {
            $(".sibyl-brand-text").hide();
        }
    },

    _setFavicon(faviconUrl) {
        let link = document.querySelector("link[rel='icon']");
        if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
        }
        link.href = faviconUrl;
    },

    _applyModuleConfig(config) {
        // Apply after sidebar renders
        frappe.after_ajax(() => {
            Object.entries(config).forEach(([moduleName, settings]) => {
                if (settings.hidden) {
                    $(`.standard-sidebar-item[data-module="${moduleName}"]`).closest(".sidebar-item-container").hide();
                }
            });
        });
    },

    toggle() {
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        const next = isDark ? "light" : "dark";

        if (!this._current?.enable_dark_mode && next === "dark") {
            sibyl.ui.toast("Dark mode is not enabled in the active theme", "orange", 2);
            return;
        }

        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("sibyl_dark_mode", next === "dark");

        sibyl.ui.toast(
            next === "dark" ? "🌙 Dark mode on" : "☀️ Light mode on",
            "blue", 2
        );
    },

    /**
     * Live update from theme builder — applies CSS instantly
     * without page reload.
     */
    liveUpdate(css, themeData = {}) {
        this._injectCSS(css);
        if (themeData.app_name) this._setAppName(themeData.app_name);
        if (themeData.logo) this._setLogo(themeData.logo, themeData.show_brand_text, themeData.app_name);
    },

    getCurrent() {
        return this._current;
    },
};

// Apply theme immediately — before DOM ready
if (window.frappe && frappe.boot && frappe.boot.sibyl_theme) {
    sibyl.theme.init();
}


// ════════════════════════════════════════════
//  CORE — full initialization after DOM ready
// ════════════════════════════════════════════

frappe.provide("sibyl.ui");
frappe.provide("sibyl.utils");
frappe.provide("sibyl.admin");

$(document).ready(() => {
    // Re-init theme (in case boot wasn't ready earlier)
    sibyl.theme.init();

    // Core setup
    sibyl.core.init();
});


sibyl.core = {
    init() {
        console.log(
            `%c Sibyl ERP v${sibyl.version} `,
            "background:#5B6AF0;color:#fff;padding:3px 10px;border-radius:4px;font-weight:700;"
        );

        this._patchFrappe();
        this._setupKeyboard();
        this._setupPageTransitions();
    },

    _patchFrappe() {
        // Patch browser title to include app name
        const _origTitle = frappe.ui.set_title;
        frappe.ui.set_title = function(title) {
            const appName = frappe.boot?.sibyl_theme?.app_name || "Sibyl ERP";
            document.title = title ? `${title} — ${appName}` : appName;
        };

        // Patch frappe.show_alert to use Sibyl toasts
        const _origAlert = frappe.show_alert;
        frappe.show_alert = function(message, seconds = 3) {
            if (typeof message === "string") {
                sibyl.ui.toast(message, "blue", seconds);
            } else {
                sibyl.ui.toast(message.message, message.indicator || "blue", seconds);
            }
        };
    },

    _setupKeyboard() {
        $(document).on("keydown", e => {
            // Cmd/Ctrl + K → search
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                $(".navbar-search input, .awesomplete input").first().focus();
            }
            // Cmd/Ctrl + Shift + D → dark mode
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "D") {
                e.preventDefault();
                sibyl.theme.toggle();
            }
            // Cmd/Ctrl + Shift + T → open theme builder
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "T") {
                e.preventDefault();
                frappe.set_route("sibyl-theme-builder");
            }
        });
    },

    _setupPageTransitions() {
        $(document).on("page-change", () => {
            $(".page-wrapper").css("opacity", 0);
            requestAnimationFrame(() => {
                $(".page-wrapper").css({
                    opacity: 1,
                    transition: "opacity 150ms ease"
                });
            });
        });
    },
};


// ════════════════════════════════════════════
//  UI UTILITIES
// ════════════════════════════════════════════

sibyl.ui = {

    toast(message, type = "blue", duration = 3) {
        const palette = {
            blue:   { bg: "#EEF2FF", border: "#5B6AF0", text: "#3730A3", icon: "ℹ" },
            green:  { bg: "#ECFDF5", border: "#10B981", text: "#065F46", icon: "✓" },
            red:    { bg: "#FEF2F2", border: "#F0564A", text: "#991B1B", icon: "✕" },
            orange: { bg: "#FFFBEB", border: "#F5A623", text: "#92400E", icon: "⚠" },
            yellow: { bg: "#FFFBEB", border: "#F5A623", text: "#92400E", icon: "⚠" },
            purple: { bg: "#F5F3FF", border: "#8B5CF6", text: "#4C1D95", icon: "★" },
        };
        const c = palette[type] || palette.blue;
        const id = `sibyl-toast-${Date.now()}`;

        // Stack toasts
        const offset = document.querySelectorAll(".sibyl-toast").length * 58;

        const $t = $(`
            <div id="${id}" class="sibyl-toast" style="
                position:fixed;
                bottom:${24 + offset}px;
                right:24px;
                background:${c.bg};
                border:1px solid ${c.border};
                border-left:4px solid ${c.border};
                color:${c.text};
                padding:11px 16px;
                border-radius:10px;
                font-size:13px;
                font-weight:500;
                font-family:var(--sibyl-font,'Inter',sans-serif);
                box-shadow:0 8px 24px rgba(0,0,0,0.10);
                z-index:99999;
                max-width:380px;
                min-width:220px;
                opacity:0;
                transform:translateX(16px);
                transition:all 0.22s cubic-bezier(0.4,0,0.2,1);
                cursor:pointer;
                display:flex;
                align-items:center;
                gap:10px;
                user-select:none;
            ">
                <span style="font-size:15px;flex-shrink:0;">${c.icon}</span>
                <span>${message}</span>
            </div>
        `);

        $("body").append($t);
        requestAnimationFrame(() => {
            $t.css({ opacity: 1, transform: "translateX(0)" });
        });

        const dismiss = () => {
            $t.css({ opacity: 0, transform: "translateX(16px)" });
            setTimeout(() => $t.remove(), 220);
        };
        $t.on("click", dismiss);
        setTimeout(dismiss, duration * 1000);
    },

    loading(msg = "Loading...") {
        if ($("#sibyl-loading").length) return;
        $("body").append(`
            <div id="sibyl-loading" style="
                position:fixed;inset:0;
                background:rgba(14,19,41,0.4);
                backdrop-filter:blur(3px);
                z-index:99998;
                display:flex;align-items:center;justify-content:center;
            ">
                <div style="
                    background:var(--sibyl-card-bg,#fff);
                    border-radius:14px;
                    padding:24px 32px;
                    display:flex;align-items:center;gap:14px;
                    font-family:var(--sibyl-font,'Inter',sans-serif);
                    font-size:14px;font-weight:500;
                    color:var(--sibyl-text,'#1C2240');
                    box-shadow:0 20px 60px rgba(0,0,0,0.2);
                ">
                    <div style="
                        width:22px;height:22px;
                        border:2.5px solid var(--sibyl-primary-light,'#EEF0FD');
                        border-top-color:var(--sibyl-primary,'#5B6AF0');
                        border-radius:50%;
                        animation:sibyl-spin 0.65s linear infinite;
                    "></div>
                    ${msg}
                </div>
            </div>
        `);
        if (!document.getElementById("sibyl-spin-style")) {
            const s = document.createElement("style");
            s.id = "sibyl-spin-style";
            s.textContent = "@keyframes sibyl-spin{to{transform:rotate(360deg)}}";
            document.head.appendChild(s);
        }
    },

    stopLoading() {
        $("#sibyl-loading").fadeOut(150, function() { $(this).remove(); });
    },
};


// ════════════════════════════════════════════
//  ADMIN API — theme management from JS
// ════════════════════════════════════════════

sibyl.admin = {

    saveTheme(themeData) {
        return frappe.call({
            method: "sibyl_erp.doctype.sibyl_theme.sibyl_theme.save_theme_from_builder",
            args: { theme_data: themeData },
            freeze: true,
            freeze_message: "Saving theme...",
        }).then(r => {
            if (r.message?.success) {
                // Apply new CSS immediately — no reload needed
                sibyl.theme.liveUpdate(r.message.css, themeData);
                sibyl.ui.toast("Theme saved & applied ✓", "green", 3);
            }
            return r.message;
        });
    },

    getPreviewCSS(themeName) {
        return frappe.call({
            method: "sibyl_erp.doctype.sibyl_theme.sibyl_theme.get_theme_preview_css",
            args: { theme_name: themeName },
        }).then(r => r.message);
    },

    setClientTheme(clientName, themeName) {
        return frappe.call({
            method: "sibyl_erp.doctype.sibyl_theme.sibyl_theme.set_client_theme",
            args: { client_name: clientName, theme_name: themeName },
        }).then(r => {
            sibyl.ui.toast(`Theme applied to ${clientName}`, "green", 3);
            return r.message;
        });
    },

    getAllThemes() {
        return frappe.call({
            method: "sibyl_erp.doctype.sibyl_theme.sibyl_theme.get_all_themes",
        }).then(r => r.message);
    },

    getAllClients() {
        return frappe.call({
            method: "sibyl_erp.doctype.sibyl_theme.sibyl_theme.get_all_clients",
        }).then(r => r.message);
    },
};


// ════════════════════════════════════════════
//  UTILS
// ════════════════════════════════════════════

sibyl.utils = {
    debounce(fn, ms = 300) {
        let t;
        return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
    },
    hasRole(role) {
        return frappe.user_roles?.includes(role);
    },
    isSibylAdmin() {
        return this.hasRole("System Manager") || this.hasRole("Sibyl Admin");
    },
    copy(text) {
        navigator.clipboard.writeText(text).then(() => {
            sibyl.ui.toast("Copied", "green", 1.5);
        });
    },
};
