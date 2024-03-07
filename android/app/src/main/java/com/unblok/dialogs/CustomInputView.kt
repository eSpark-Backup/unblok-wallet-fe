package com.unblok.dialogs

import android.app.Dialog
import android.inputmethodservice.InputMethodService
import android.view.LayoutInflater
import android.view.View
import android.view.inputmethod.EditorInfo
import com.unblock.R

class CustomKeyboardService : InputMethodService() {

    private lateinit var customDialog: Dialog

    override fun onCreateInputView(): View {
        // Inflate your custom input view layout here
        val customInputView = LayoutInflater.from(this).inflate(R.layout.dialog_edit_text, null)

        // Create and configure your custom dialogue box
        customDialog = Dialog(this)
        customDialog.setContentView(R.layout.dialog_edit_text)

        // Handle dialogue box UI and input logic here

        return customInputView
    }
    override fun onStartInputView(info: EditorInfo?, restarting: Boolean) {
        super.onStartInputView(info, restarting)
//        inputView?.requestFocus()
    }

    // Handle keypress events and text input here

    // Show the dialogue box when needed
    private fun showCustomDialog() {
        customDialog.show()
    }
}