package org.dslul.openboard.inputmethodcommon

import android.content.Context
import android.content.Intent
import android.provider.Settings
import android.widget.Toast

class KeyboardSettingsManager(private val context: Context) {

    fun openKeyboardSettingsAndShowToast() {
        // Open keyboard settings
        val intent = Intent(Settings.ACTION_INPUT_METHOD_SETTINGS)
        context.startActivity(intent)

        // Show toast message
        showToast("Enable Voice Typing")
    }

    private fun showToast(message: String) {
        Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
    }
}
