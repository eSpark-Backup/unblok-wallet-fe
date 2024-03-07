package org.dslul.openboard.inputmethod.latin.settings

import android.content.Context
import android.content.Intent
import android.provider.Settings
import android.view.inputmethod.InputMethodManager
import android.widget.Toast

class KeyboardSettingsFragment(private val context: Context) {

    fun openKeyboardSettingsAndShowToast() {
//        if (isGoogleVoiceTypingEnabled()) {
//            // Google Voice Typing is enabled, show toast
//            showToast("Google Voice Typing is already enabled")
//        } else {
            // Google Voice Typing is not enabled, show toast and open keyboard settings
            showToast("Ensure Google Voice Typing is Enabled")
            val intent = Intent(Settings.ACTION_INPUT_METHOD_SETTINGS)
            context.startActivity(intent)
  //      }
    }

    private fun isGoogleVoiceTypingEnabled(): Boolean {
        val inputMethodManager = context.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
        val enabledInputMethodList = inputMethodManager.enabledInputMethodList

        for (inputMethodInfo in enabledInputMethodList) {
            if (inputMethodInfo.packageName == "com.google.android.inputmethod.latin") {
                return true
            }
        }

        return false
    }

    private fun showToast(message: String) {
        Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
    }
}



