package com.simplemobiletools.commons.dialogs

import androidx.appcompat.app.AlertDialog
import com.google.android.material.textfield.TextInputEditText
import com.simplemobiletools.commons.R
import com.simplemobiletools.commons.activities.BaseSimpleActivity
import com.simplemobiletools.commons.extensions.*
import com.simplemobiletools.commons.views.MyTextView

class ExportSettingsDialog(
    val activity: BaseSimpleActivity, val defaultFilename: String, val hidePath: Boolean,
    callback: (path: String, filename: String) -> Unit
) {
    init {
        val lastUsedFolder = activity.baseConfig.lastExportedSettingsFolder
        var folder = if (lastUsedFolder.isNotEmpty() && activity.getDoesFilePathExist(lastUsedFolder)) {
            lastUsedFolder
        } else {
            activity.internalStoragePath
        }

        val view = activity.layoutInflater.inflate(R.layout.dialog_export_settings, null).apply {
            findViewById<TextInputEditText>(R.id.export_settings_filename).setText(defaultFilename.removeSuffix(".txt"))

            if (hidePath) {
                findViewById<TextInputEditText>(R.id.export_settings_path_hint).beGone()
            } else {
                findViewById<TextInputEditText>(R.id.export_settings_path).setText(activity.humanizePath(folder))
                findViewById<TextInputEditText>(R.id.export_settings_path).setOnClickListener {
                    FilePickerDialog(activity, folder, false, showFAB = true) {
                        findViewById<TextInputEditText>(R.id.export_settings_path).setText(activity.humanizePath(it))
                        folder = it
                    }
                }
            }
        }

        activity.getAlertDialogBuilder()
            .setPositiveButton(R.string.ok, null)
            .setNegativeButton(R.string.cancel, null)
            .apply {
                activity.setupDialogStuff(view, this, R.string.export_settings) { alertDialog ->
                    alertDialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener {
                        var filename = view.findViewById<TextInputEditText>(R.id.export_settings_filename).value
                        if (filename.isEmpty()) {
                            activity.toast(R.string.filename_cannot_be_empty)
                            return@setOnClickListener
                        }

                        filename += ".txt"
                        val newPath = "${folder.trimEnd('/')}/$filename"
                        if (!newPath.getFilenameFromPath().isAValidFilename()) {
                            activity.toast(R.string.filename_invalid_characters)
                            return@setOnClickListener
                        }

                        activity.baseConfig.lastExportedSettingsFolder = folder
                        if (!hidePath && activity.getDoesFilePathExist(newPath)) {
                            val title = String.format(activity.getString(R.string.file_already_exists_overwrite), newPath.getFilenameFromPath())
                            ConfirmationDialog(activity, title) {
                                callback(newPath, filename)
                                alertDialog.dismiss()
                            }
                        } else {
                            callback(newPath, filename)
                            alertDialog.dismiss()
                        }
                    }
                }
            }
    }
}
