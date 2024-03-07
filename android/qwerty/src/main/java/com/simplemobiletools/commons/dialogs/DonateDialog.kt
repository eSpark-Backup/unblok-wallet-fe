package com.simplemobiletools.commons.dialogs

import android.app.Activity
import android.text.Html
import android.text.method.LinkMovementMethod
import android.widget.ImageView
import com.simplemobiletools.commons.R
import com.simplemobiletools.commons.extensions.*
import com.simplemobiletools.commons.views.MyTextView

class DonateDialog(val activity: Activity) {
    init {
        val view = activity.layoutInflater.inflate(R.layout.dialog_donate, null).apply {
            findViewById<ImageView>(R.id.dialog_donate_image).applyColorFilter(activity.getProperTextColor())
            findViewById<MyTextView>(R.id.dialog_donate_text).text = Html.fromHtml(activity.getString(R.string.donate_short))
            findViewById<MyTextView>(R.id.dialog_donate_text).movementMethod = LinkMovementMethod.getInstance()
            findViewById<ImageView>(R.id.dialog_donate_image).setOnClickListener {
                activity.launchViewIntent(R.string.thank_you_url)
            }
        }

        activity.getAlertDialogBuilder()
            .setPositiveButton(R.string.purchase) { dialog, which -> activity.launchViewIntent(R.string.thank_you_url) }
            .setNegativeButton(R.string.later, null)
            .apply {
                activity.setupDialogStuff(view, this, cancelOnTouchOutside = false)
            }
    }
}
