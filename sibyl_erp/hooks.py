from . import __version__ as app_version

# ─────────────────────────────────────────────
#  App Identity
# ─────────────────────────────────────────────
app_name        = "sibyl_erp"
app_title       = "Sibyl ERP"
app_publisher   = "Sibyl Technologies"
app_description = "Sibyl ERP — Built on Frappe. Redefined."
app_email       = "dev@sibyl.io"
app_license     = "MIT"

# ─────────────────────────────────────────────
#  Branding (fallback if no theme set yet)
# ─────────────────────────────────────────────
brand_html = """
<a href="/" class="sibyl-brand">
    <img src="/assets/sibyl_erp/img/sibyl-logo.svg"
         class="sibyl-logo" alt="Sibyl ERP" height="26"
         onerror="this.style.display='none'">
    <span class="sibyl-brand-text">Sibyl ERP</span>
</a>
"""

# ─────────────────────────────────────────────
#  Static Assets
# ─────────────────────────────────────────────
app_include_css = [
    "/assets/sibyl_erp/css/sibyl-variables.css",
    "/assets/sibyl_erp/css/sibyl-base.css",
    "/assets/sibyl_erp/css/sibyl-navbar.css",
    "/assets/sibyl_erp/css/sibyl-sidebar.css",
    "/assets/sibyl_erp/css/sibyl-desk.css",
    "/assets/sibyl_erp/css/sibyl-forms.css",
    "/assets/sibyl_erp/css/sibyl-list.css",
    "/assets/sibyl_erp/css/sibyl-modals.css",
]

app_include_js = [
    "/assets/sibyl_erp/js/sibyl-core.js",
]

web_include_css = [
    "/assets/sibyl_erp/css/sibyl-variables.css",
    "/assets/sibyl_erp/css/sibyl-web.css",
]

# ─────────────────────────────────────────────
#  Theme Engine — boot injection
#  This is where the magic happens:
#  On EVERY page load, inject the active theme CSS
#  into frappe.boot so sibyl-core.js applies it
#  instantly with zero flash.
# ─────────────────────────────────────────────
boot_session = "sibyl_erp.doctype.sibyl_theme.sibyl_theme.inject_theme_on_boot"

# ─────────────────────────────────────────────
#  Jinja
# ─────────────────────────────────────────────
jinja = {
    "methods": [
        "sibyl_erp.utils.jinja.get_sibyl_config",
    ],
    "filters": [],
}

# ─────────────────────────────────────────────
#  DocType JS overrides
# ─────────────────────────────────────────────
doctype_js = {
    # "Sales Invoice": "public/js/overrides/sales_invoice.js",
}

# ─────────────────────────────────────────────
#  Install / Migrate
# ─────────────────────────────────────────────
after_install = "sibyl_erp.setup.install.after_install"
after_migrate = "sibyl_erp.setup.install.after_migrate"

# ─────────────────────────────────────────────
#  Fixtures — exported with the app
# ─────────────────────────────────────────────
fixtures = [
    {
        "doctype": "Sibyl Theme",
        "filters": [["is_default", "=", 1]]
    },
]

# ─────────────────────────────────────────────
#  Roles
# ─────────────────────────────────────────────
has_permission = {
    "Sibyl Theme":  "sibyl_erp.doctype.sibyl_theme.sibyl_theme.has_permission",
    "Sibyl Client": "sibyl_erp.doctype.sibyl_client.sibyl_client.has_permission",
}
