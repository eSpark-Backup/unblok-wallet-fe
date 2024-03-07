package com.unblok.adapters

import android.content.ClipboardManager
import android.content.Context
import java.util.ArrayList

class ClipboardManagerHelper(private val context: Context) {
    private val clipboardManager =
        context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
    private val clipboardHistory = ArrayList<ClipboardItem>()

    data class ClipboardItem(val text: String, var isPinned: Boolean = false)

    init {
        clipboardManager.addPrimaryClipChangedListener { updateClipboardHistory() }
    }

    private fun updateClipboardHistory() {
        val clipData = clipboardManager.primaryClip
        if (clipData != null && clipData.itemCount > 0) {
            val newClipText = clipData.getItemAt(0).text.toString()
            val existingClip = clipboardHistory.find { it.text == newClipText }

            if (existingClip != null) {
                clipboardHistory.remove(existingClip)
            }
            val newClipboardItem = ClipboardItem(newClipText)
            clipboardHistory.add(0, newClipboardItem)

            if (clipboardHistory.size > 7) {
                clipboardHistory.removeAt(clipboardHistory.size - 1)
            }
        }
    }

    fun getClipboardHistory(): List<ClipboardItem> {
        return clipboardHistory
    }

    fun deleteClipboardItem(clip: ClipboardItem) {
        clipboardHistory.remove(clip)
    }
}
