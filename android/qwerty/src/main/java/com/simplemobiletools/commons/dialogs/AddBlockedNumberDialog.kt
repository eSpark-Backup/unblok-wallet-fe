package com.simplemobiletools.commons.dialogs

import androidx.appcompat.app.AlertDialog
import com.google.android.material.textfield.TextInputEditText
import com.simplemobiletools.commons.R
import com.simplemobiletools.commons.activities.BaseSimpleActivity
import com.simplemobiletools.commons.extensions.*
import com.simplemobiletools.commons.models.BlockedNumber

class AddBlockedNumberDialog(val activity: BaseSimpleActivity, val originalNumber: BlockedNumber? = null, val callback: () -> Unit) {
    init {
        val view = activity.layoutInflater.inflate(R.layout.dialog_add_blocked_number, null).apply {
            if (originalNumber != null) {
                findViewById<TextInputEditText>(R.id.add_blocked_number_edittext).setText(originalNumber.number)
            }
        }

        activity.getAlertDialogBuilder()
            .setPositiveButton(R.string.ok, null)
            .setNegativeButton(R.string.cancel, null)
            .apply {
                activity.setupDialogStuff(view, this) { alertDialog ->
                    alertDialog.showKeyboard(view.findViewById<TextInputEditText>(R.id.add_blocked_number_edittext))
                    alertDialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener {
                        var newBlockedNumber = view.findViewById<TextInputEditText>(R.id.add_blocked_number_edittext).value
                        if (originalNumber != null && newBlockedNumber != originalNumber.number) {
                            activity.deleteBlockedNumber(originalNumber.number)
                        }

                        if (newBlockedNumber.isNotEmpty()) {
                            // in case the user also added a '.' in the pattern, remove it
                            if (newBlockedNumber.contains(".*")) {
                                newBlockedNumber = newBlockedNumber.replace(".*", "*")
                            }
                            activity.addBlockedNumber(newBlockedNumber)
                        }

                        callback()
                        alertDialog.dismiss()
                    }
                }
            }
    }
}
