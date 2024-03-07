package com.simplemobiletools.commons.dialogs

import android.view.View
import android.widget.RadioGroup
import com.simplemobiletools.commons.R
import com.simplemobiletools.commons.activities.BaseSimpleActivity
import com.simplemobiletools.commons.extensions.baseConfig
import com.simplemobiletools.commons.extensions.getAlertDialogBuilder
import com.simplemobiletools.commons.extensions.setupDialogStuff
import com.simplemobiletools.commons.helpers.VIEW_TYPE_GRID
import com.simplemobiletools.commons.helpers.VIEW_TYPE_LIST
import com.simplemobiletools.commons.views.MyCompatRadioButton

class ChangeViewTypeDialog(val activity: BaseSimpleActivity, val path: String = "", val callback: () -> Unit) {
    private var view: View
    private var config = activity.baseConfig

    init {
        view = activity.layoutInflater.inflate(R.layout.dialog_change_view_type, null).apply {
            val viewToCheck = when (config.viewType) {
                VIEW_TYPE_GRID -> findViewById<MyCompatRadioButton>(R.id.change_view_type_dialog_radio_grid).id
                else -> findViewById<MyCompatRadioButton>(R.id.change_view_type_dialog_radio_list).id
            }

            findViewById<RadioGroup>(R.id.change_view_type_dialog_radio).check(viewToCheck)
        }

        activity.getAlertDialogBuilder()
            .setPositiveButton(R.string.ok) { dialog, which -> dialogConfirmed() }
            .setNegativeButton(R.string.cancel, null)
            .apply {
                activity.setupDialogStuff(view, this)
            }
    }

    private fun dialogConfirmed() {
        val viewType = if (view.findViewById<MyCompatRadioButton>(R.id.change_view_type_dialog_radio_grid).isChecked) {
            VIEW_TYPE_GRID
        } else {
            VIEW_TYPE_LIST
        }
        config.viewType = viewType
        callback()
    }
}
