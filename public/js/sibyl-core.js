/**
 * ╔══════════════════════════════════════════════╗
 * ║  SIBYL ERP — Core JavaScript                ║
 * ║  v1.0.0                                      ║
 * ╚══════════════════════════════════════════════╝
 *
 * Loaded on every Frappe desk page.
 * Overrides, extensions, and Sibyl-specific behavior.
 */

"use strict";

/* ── Namespace ────────────────────────────────── */
window.sibyl = window.sibyl || {};

sibyl.version = "1.0.0";
sibyl.config = {
    app_name:       "Sibyl ERP",
    brand_name:     "Sibyl",
    support_email:  "support@sibyl.io",
    docs_url:       "https://docs.sibyl.io",
    logo_url:       "/assets/sibyl_erp/img/sibyl-logo.svg",
    dark_mode:      false,
};

/* ════════════════════════════════════════════════
   CORE — Initialize after Frappe desk is ready
═══════════════════════════════════════════════ */
frappe.provide("sibyl.ui");
frappe.provide("sibyl.utils");
frappe.provide("sibyl.theme");

$(document).ready(function () {
    // Wait for Frappe to fully boot
    frappe.after_ajax = frappe.after_ajax || function (fn) { fn(); };

    if (frappe.boot) {
        sibyl.core.init();
    } else {
        $(document).on("frappe.boot", () => sibyl.core.init());
    }
});

/* ════════════════════════════════════════════════
   SIBYL CORE
═══════════════════════════════════════════════ */
sibyl.core = {

    init() {
        console.log("%c Sibyl ERP v" + sibyl.version + " initialized ", 
            "background: #5B6AF0; color: white; padding: 4px 10px; border-radius: 4px; font-weight: 600;"
        );

        this.patch_frappe();
        this.setup_brand();
        this.setup_theme();
        this.setup_keyboard_shortcuts();
        this.setup_page_transitions();
        this.override_error_handler();
        this.setup_tooltips();
    },

    /* ── Patch Frappe internals ─────────────────── */
    patch_frappe() {
        // Override the browser title
        const _set_title = frappe.ui.set_title || function() {};
        frappe.ui.set_title = function(title) {
            document.title = title 
                ? `${title} | ${sibyl.config.app_name}` 
                : sibyl.config.app_name;
        };

        // Override the default boot info
        if (frappe.boot) {
            frappe.boot.app_name = sibyl.config.app_name;
        }

        // Patch toast notifications to use Sibyl style
        const _show_alert = frappe.show_alert;
        frappe.show_alert = function(message, seconds) {
            if (typeof message === "string") {
                message = { message: message, indicator: "blue" };
            }
            sibyl.ui.toast(message.message, message.indicator, seconds);
        };
    },

    /* ── Brand Setup ────────────────────────────── */
    setup_brand() {
        // Set favicon
        const favicon = document.querySelector("link[rel='icon']") 
            || document.createElement("link");
        favicon.rel = "icon";
        favicon.href = "/assets/sibyl_erp/img/sibyl-favicon.png";
        document.head.appendChild(favicon);

        // Set page title
        document.title = sibyl.config.app_name;

        // Apple touch icon
        const apple_icon = document.querySelector("link[rel='apple-touch-icon']")
            || document.createElement("link");
        apple_icon.rel = "apple-touch-icon";
        apple_icon.href = "/assets/sibyl_erp/img/sibyl-icon-180.png";
        document.head.appendChild(apple_icon);
    },

    /* ── Theme System ───────────────────────────── */
    setup_theme() {
        // Check user preference
        const saved_theme = localStorage.getItem("sibyl_theme") 
            || (frappe.boot && frappe.boot.user && frappe.boot.user.sibyl_theme)
            || "light";

        sibyl.theme.apply(saved_theme);
    },

    /* ── Keyboard Shortcuts ─────────────────────── */
    setup_keyboard_shortcuts() {
        // Cmd/Ctrl + K → Quick open (like Frappe's awesomebar but better)
        $(document).on("keydown", function(e) {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                sibyl.ui.quick_open();
            }

            // Cmd + Shift + D → Toggle dark mode
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "D") {
                e.preventDefault();
                sibyl.theme.toggle();
            }

            // Escape → Close any sibyl modals / panels
            if (e.key === "Escape") {
                sibyl.ui.close_active_panel();
            }
        });
    },

    /* ── Page Transitions ───────────────────────── */
    setup_page_transitions() {
        // Add fade-in animation on route change
        $(document).on("page-change", function() {
            $(".page-wrapper, .page-body").addClass("sibyl-animate-in");
            setTimeout(() => {
                $(".page-wrapper, .page-body").removeClass("sibyl-animate-in");
            }, 300);
        });
    },

    /* ── Error Handler ──────────────────────────── */
    override_error_handler() {
        const _original = window.onerror;
        window.onerror = function(msg, url, line, col, error) {
            // Log to console with Sibyl branding
            console.error("[Sibyl ERP Error]", { msg, url, line, col, error });
            if (_original) return _original(msg, url, line, col, error);
        };
    },

    /* ── Tooltips ───────────────────────────────── */
    setup_tooltips() {
        // Enhance Frappe's tooltip with Sibyl styles
        $("[data-toggle='tooltip'], [title]").tooltip({
            trigger: "hover",
            placement: "top",
            delay: { show: 400, hide: 100 }
        });
    },
};


/* ════════════════════════════════════════════════
   SIBYL THEME ENGINE
═══════════════════════════════════════════════ */
sibyl.theme = {

    current: "light",

    apply(theme_name) {
        this.current = theme_name;
        const html = document.documentElement;

        if (theme_name === "dark") {
            html.setAttribute("data-theme", "dark");
            html.classList.add("dark-theme");
            html.classList.remove("light-theme");
        } else {
            html.setAttribute("data-theme", "light");
            html.classList.add("light-theme");
            html.classList.remove("dark-theme");
        }

        localStorage.setItem("sibyl_theme", theme_name);

        // Sync with Frappe's own theme system
        if (frappe && frappe.ui && frappe.ui.color) {
            // frappe.ui.color.set_primary(sibyl.config.primary_color);
        }

        $(document).trigger("sibyl.theme.changed", { theme: theme_name });
    },

    toggle() {
        const next = this.current === "light" ? "dark" : "light";
        this.apply(next);
        sibyl.ui.toast(
            `Switched to ${next === "dark" ? "🌙 Dark" : "☀️ Light"} mode`,
            "green",
            2
        );
    },

    is_dark() {
        return this.current === "dark";
    }
};


/* ════════════════════════════════════════════════
   SIBYL UI UTILITIES
═══════════════════════════════════════════════ */
sibyl.ui = {

    /* ── Toast Notification ─────────────────────── */
    toast(message, type = "blue", duration = 3) {
        const colors = {
            blue:   { bg: "#EEF2FF", border: "#5B6AF0", text: "#3730A3" },
            green:  { bg: "#ECFDF5", border: "#2ECC71", text: "#065F46" },
            red:    { bg: "#FEF2F2", border: "#F0564A", text: "#991B1B" },
            orange: { bg: "#FFFBEB", border: "#F5A623", text: "#92400E" },
            yellow: { bg: "#FFFBEB", border: "#F5A623", text: "#92400E" },
        };

        const color = colors[type] || colors.blue;
        const id = "sibyl-toast-" + Date.now();

        const $toast = $(`
            <div id="${id}" class="sibyl-toast" style="
                position: fixed;
                bottom: 24px;
                right: 24px;
                background: ${color.bg};
                border: 1px solid ${color.border};
                border-left: 4px solid ${color.border};
                color: ${color.text};
                padding: 12px 16px;
                border-radius: 8px;
                font-size: 13px;
                font-weight: 500;
                font-family: var(--sibyl-font-sans);
                box-shadow: 0 8px 24px rgba(14,19,41,0.12);
                z-index: 10000;
                max-width: 380px;
                opacity: 0;
                transform: translateY(8px);
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 8px;
                cursor: pointer;
            ">
                ${message}
            </div>
        `);

        $("body").append($toast);

        setTimeout(() => {
            $toast.css({ opacity: 1, transform: "translateY(0)" });
        }, 10);

        const dismiss = () => {
            $toast.css({ opacity: 0, transform: "translateY(8px)" });
            setTimeout(() => $toast.remove(), 200);
        };

        $toast.on("click", dismiss);
        setTimeout(dismiss, duration * 1000);
    },

    /* ── Quick Open (Command Palette) ───────────── */
    quick_open() {
        // Use Frappe's built-in awesome bar or extend it
        if (frappe.quick_entry) {
            frappe.quick_entry.toggle();
        } else if ($(".navbar-search input").length) {
            $(".navbar-search input").focus();
        } else {
            // Trigger Frappe's search
            $("[data-route='search']").click();
        }
    },

    /* ── Close Active Panel ─────────────────────── */
    close_active_panel() {
        // Close any open Sibyl overlays
        $(".sibyl-panel.open").removeClass("open");
    },

    /* ── Confirm Dialog ─────────────────────────── */
    confirm(title, message, callback) {
        frappe.confirm(message, callback, null, title);
    },

    /* ── Loading Overlay ────────────────────────── */
    show_loading(msg = "Loading...") {
        if ($("#sibyl-loading-overlay").length) return;
        $("body").append(`
            <div id="sibyl-loading-overlay" style="
                position: fixed; inset: 0;
                background: rgba(14,19,41,0.35);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(2px);
            ">
                <div style="
                    background: var(--card-bg);
                    border-radius: 12px;
                    padding: 24px 32px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    box-shadow: 0 16px 48px rgba(0,0,0,0.2);
                    font-size: 14px;
                    font-weight: 500;
                    color: var(--text-color);
                    font-family: var(--sibyl-font-sans);
                ">
                    <div class="sibyl-spinner"></div>
                    ${msg}
                </div>
            </div>
        `);
    },

    hide_loading() {
        $("#sibyl-loading-overlay").fadeOut(150, function() {
            $(this).remove();
        });
    },
};


/* ════════════════════════════════════════════════
   SIBYL UTILS
═══════════════════════════════════════════════ */
sibyl.utils = {

    /* Format currency using Frappe's settings */
    format_currency(value, currency) {
        return frappe.format_currency(value, currency);
    },

    /* Truncate string */
    truncate(str, len = 50) {
        if (!str) return "";
        return str.length > len ? str.substring(0, len) + "…" : str;
    },

    /* Deep copy */
    clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /* Debounce */
    debounce(fn, delay = 300) {
        let timer;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    },

    /* Throttle */
    throttle(fn, limit = 200) {
        let last = 0;
        return function(...args) {
            const now = Date.now();
            if (now - last >= limit) {
                last = now;
                fn.apply(this, args);
            }
        };
    },

    /* Check if user has role */
    has_role(role) {
        return frappe.user_roles && frappe.user_roles.includes(role);
    },

    /* Get translated string (wraps Frappe's __) */
    t(str, ...args) {
        return __(str, ...args);
    },

    /* Copy to clipboard */
    copy(text) {
        navigator.clipboard.writeText(text).then(() => {
            sibyl.ui.toast("Copied to clipboard", "green", 2);
        });
    },
};


/* ════════════════════════════════════════════════
   FRAPPE FORM EXTENSIONS
   Called on every form load via Frappe hooks
═══════════════════════════════════════════════ */
frappe.ui.form.on_all_forms = function(frm) {
    // Add Sibyl-branded form header actions
    sibyl.form.enhance(frm);
};

sibyl.form = {
    enhance(frm) {
        if (!frm) return;
        
        // Add custom CSS class for targeting
        $(frm.wrapper).addClass("sibyl-form");

        // Smooth scroll to errors
        frm.script_manager.on("after_save", function() {
            sibyl.ui.toast(`${frm.doctype} saved successfully`, "green", 3);
        });
    }
};

/* Export for module usage */
if (typeof module !== "undefined" && module.exports) {
    module.exports = { sibyl };
}
