"""
Sibyl ERP — Install & Migration Hooks
Called by Frappe after app install and after bench migrate
"""

import frappe
from frappe import _


def after_install():
    """Run once when the app is installed."""
    print("Setting up Sibyl ERP...")
    
    _set_system_defaults()
    _create_default_workspaces()
    _set_theme_defaults()

    print("✅ Sibyl ERP installed successfully.")


def after_migrate():
    """Run after every bench migrate."""
    _set_system_defaults()
    _set_theme_defaults()


def _set_system_defaults():
    """Configure System Settings for Sibyl branding."""
    try:
        settings = frappe.get_single("System Settings")

        # App name
        if hasattr(settings, "app_name"):
            settings.app_name = "Sibyl ERP"

        # Footer
        if hasattr(settings, "footer_image"):
            pass  # Set footer logo if needed

        # Default language
        if not settings.language:
            settings.language = "en"

        settings.save(ignore_permissions=True)
        frappe.db.commit()
    except Exception as e:
        frappe.log_error(f"Sibyl: Could not set system defaults: {e}")


def _create_default_workspaces():
    """Create or update Sibyl-branded workspaces."""
    
    workspaces = [
        {
            "name": "Sibyl Home",
            "title": "Home",
            "icon": "home",
            "module": "Sibyl ERP",
            "is_default": 1,
        },
    ]

    for ws in workspaces:
        if not frappe.db.exists("Workspace", ws["name"]):
            try:
                doc = frappe.new_doc("Workspace")
                doc.update(ws)
                doc.insert(ignore_permissions=True)
            except Exception as e:
                frappe.log_error(f"Sibyl: Could not create workspace {ws['name']}: {e}")


def _set_theme_defaults():
    """Set default Sibyl theme across the system."""
    try:
        # If Frappe has website theme settings
        if frappe.db.exists("DocType", "Website Theme"):
            if not frappe.db.exists("Website Theme", "Sibyl"):
                theme = frappe.new_doc("Website Theme")
                theme.theme = "Sibyl"
                theme.top_bar_color = "#0E1329"
                theme.primary_color = "#5B6AF0"
                theme.insert(ignore_permissions=True)
    except Exception as e:
        frappe.log_error(f"Sibyl: Could not set theme: {e}")
