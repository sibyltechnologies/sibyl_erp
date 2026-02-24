"""
Sibyl ERP — Install script
Runs after: bench install-app sibyl_erp
"""
import frappe


def after_install():
    _create_sibyl_admin_role()
    _create_default_theme()
    _set_system_defaults()
    frappe.db.commit()
    print("✅ Sibyl ERP installed successfully.")


def after_migrate():
    _create_sibyl_admin_role()
    _set_system_defaults()
    frappe.db.commit()


def _create_sibyl_admin_role():
    if not frappe.db.exists("Role", "Sibyl Admin"):
        role = frappe.new_doc("Role")
        role.role_name = "Sibyl Admin"
        role.desk_access = 1
        role.save(ignore_permissions=True)
        print("  → Created role: Sibyl Admin")


def _create_default_theme():
    """Creates the Sibyl Dark default theme if none exists."""
    if frappe.db.exists("Sibyl Theme", "Sibyl Dark"):
        return

    theme = frappe.new_doc("Sibyl Theme")
    theme.theme_name      = "Sibyl Dark"
    theme.is_default      = 1
    theme.is_active       = 1
    theme.scope           = "Global"
    theme.show_brand_text = 1

    # Colors
    theme.primary_color  = "#5B6AF0"
    theme.primary_dark   = "#4755D4"
    theme.primary_light  = "#EEF0FD"
    theme.accent_color   = "#00C9A7"
    theme.success_color  = "#2ECC71"
    theme.danger_color   = "#F0564A"
    theme.warning_color  = "#F5A623"
    theme.info_color     = "#3498DB"

    # Surfaces
    theme.navbar_bg   = "#0E1329"
    theme.sidebar_bg  = "#0E1329"
    theme.desk_bg     = "#F8F9FC"
    theme.card_bg     = "#FFFFFF"
    theme.text_primary= "#1C2240"
    theme.text_muted  = "#6E7A96"
    theme.border_color= "#E4E7F0"

    # Typography
    theme.font_family   = "Inter"
    theme.font_size_base= 13
    theme.line_height   = 1.5
    theme.border_radius = 8
    theme.spacing_unit  = 4

    # Layout
    theme.sidebar_width   = 220
    theme.navbar_height   = 48
    theme.card_shadow     = "Subtle"
    theme.sidebar_style   = "Dark"
    theme.navbar_style    = "Dark"
    theme.button_style    = "Rounded"
    theme.input_style     = "Default"
    theme.enable_animations = 1

    # Dark mode
    theme.enable_dark_mode = 1
    theme.dark_primary     = "#7B8BF5"
    theme.dark_navbar_bg   = "#0B0E18"
    theme.dark_sidebar_bg  = "#0B0E18"
    theme.dark_desk_bg     = "#0F1117"

    # Default module colors
    module_colors = [
        ("Accounts",      "#3498DB", "accounting"),
        ("Selling",       "#2ECC71", "selling"),
        ("Buying",        "#E67E22", "buying"),
        ("Stock",         "#9B59B6", "stock"),
        ("CRM",           "#E91E63", "crm"),
        ("HR",            "#00BCD4", "hr"),
        ("Projects",      "#FF9800", "project"),
        ("Manufacturing", "#607D8B", "manufacturing"),
        ("Assets",        "#795548", "asset"),
    ]
    for module_name, color, icon in module_colors:
        theme.append("module_colors", {
            "module_name": module_name,
            "color":       color,
            "icon":        icon,
            "hidden":      0,
        })

    theme.save(ignore_permissions=True)
    print("  → Created default theme: Sibyl Dark")


def _set_system_defaults():
    """Apply Sibyl branding to Frappe system settings."""
    try:
        settings = frappe.get_single("System Settings")
        if not settings.app_name or settings.app_name in ("ERPNext", "Frappe"):
            settings.app_name = "Sibyl ERP"
            settings.save(ignore_permissions=True)
            print("  → Updated System Settings: app_name = Sibyl ERP")
    except Exception:
        pass
