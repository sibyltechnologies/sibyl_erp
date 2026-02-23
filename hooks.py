from . import __version__ as app_version

# ─────────────────────────────────────────────
#  App Identity
# ─────────────────────────────────────────────
app_name            = "sibyl_erp"
app_title           = "Sibyl ERP"
app_publisher       = "Sibyl Technologies"
app_description     = "Sibyl ERP — Built on Frappe. Redefined."
app_email           = "dev@sibyl.io"
app_license         = "MIT"
app_version         = "1.0.0"

# ─────────────────────────────────────────────
#  Branding
# ─────────────────────────────────────────────
brand_html = """
<a href="/sibyl-home" class="sibyl-brand">
    <img src="/assets/sibyl_erp/img/sibyl-logo.svg" 
         class="sibyl-logo" 
         alt="Sibyl ERP" 
         height="28" />
    <span class="sibyl-brand-text">Sibyl ERP</span>
</a>
"""


# ─────────────────────────────────────────────
#  Asset Injection (ORDER MATTERS)
# ─────────────────────────────────────────────
app_include_css = [
    "/assets/sibyl_erp/css/sibyl-variables.css",   # CSS vars first
    "/assets/sibyl_erp/css/sibyl-base.css",         # Base resets & typography
    "/assets/sibyl_erp/css/sibyl-navbar.css",        # Top navbar
    "/assets/sibyl_erp/css/sibyl-sidebar.css",       # Left sidebar
    "/assets/sibyl_erp/css/sibyl-desk.css",          # Desk / workspace
    "/assets/sibyl_erp/css/sibyl-forms.css",         # DocType forms
    "/assets/sibyl_erp/css/sibyl-list.css",          # List views
    "/assets/sibyl_erp/css/sibyl-modals.css",        # Dialogs & modals
    "/assets/sibyl_erp/css/sibyl-print.css",         # Print formats
    "/assets/sibyl_erp/css/sibyl-theme-dark.css",    # Dark theme overrides
]

app_include_js = [
    "/assets/sibyl_erp/js/sibyl-core.js",           # Core overrides & utils
    "/assets/sibyl_erp/js/sibyl-desk.js",            # Desk customizations
    "/assets/sibyl_erp/js/sibyl-navbar.js",          # Navbar behavior
    "/assets/sibyl_erp/js/sibyl-icons.js",           # Icon system
    "/assets/sibyl_erp/js/sibyl-notifications.js",   # Custom notifications
]

# Web (public-facing) pages
web_include_css = [
    "/assets/sibyl_erp/css/sibyl-web.css",
]

web_include_js = [
    "/assets/sibyl_erp/js/sibyl-web.js",
]

# ─────────────────────────────────────────────
#  Template Overrides
# ─────────────────────────────────────────────
# Override Frappe's built-in templates with Sibyl versions
override_doctype_dashboards = {}

# Custom page renderers
page_js = {
    "setup-wizard": "public/js/sibyl-setup-wizard.js",
}

# ─────────────────────────────────────────────
#  DocType JS / Python Overrides
# ─────────────────────────────────────────────
doctype_js = {
    # Example — uncomment and extend as needed:
    # "Sales Invoice": "public/js/overrides/sales_invoice.js",
    # "Purchase Order": "public/js/overrides/purchase_order.js",
}

doctype_list_js = {}

doctype_tree_js = {}

doctype_calendar_js = {}

# ─────────────────────────────────────────────
#  Python Class Overrides
# ─────────────────────────────────────────────
override_doctype_class = {
    # "User": "sibyl_erp.overrides.user.SibylUser",
}

# ─────────────────────────────────────────────
#  Whitelisted API Methods
# ─────────────────────────────────────────────
override_whitelisted_methods = {
    # "frappe.client.get": "sibyl_erp.api.client.get",
}

# ─────────────────────────────────────────────
#  Fixtures — Export these DocTypes with your app
# ─────────────────────────────────────────────
fixtures = [
    # Workspaces define the sidebar structure
    {
        "doctype": "Workspace",
        "filters": [["module", "in", ["Sibyl ERP"]]]
    },
    # System settings defaults
    {
        "doctype": "System Settings",
    },
]

# ─────────────────────────────────────────────
#  Hooks — Document Lifecycle
# ─────────────────────────────────────────────
doc_events = {
    "*": {
        # "on_submit": "sibyl_erp.utils.audit.log_submission",
    }
}

# ─────────────────────────────────────────────
#  Scheduler
# ─────────────────────────────────────────────
scheduler_events = {
    "daily": [
        # "sibyl_erp.utils.maintenance.daily_cleanup",
    ],
    "hourly": [],
    "weekly": [],
}

# ─────────────────────────────────────────────
#  On App Install
# ─────────────────────────────────────────────
after_install = "sibyl_erp.setup.install.after_install"
after_migrate = "sibyl_erp.setup.install.after_migrate"

# ─────────────────────────────────────────────
#  Website / Portal
# ─────────────────────────────────────────────
website_route_rules = [
    {"from_route": "/sibyl-home", "to_route": "sibyl_home"},
]

# ─────────────────────────────────────────────
#  User Data Protection
# ─────────────────────────────────────────────
user_data_fields = []

# ─────────────────────────────────────────────
#  Jinja Environment
# ─────────────────────────────────────────────
jinja = {
    "methods": [
        "sibyl_erp.utils.jinja.get_sibyl_config",
    ],
    "filters": [],
}
