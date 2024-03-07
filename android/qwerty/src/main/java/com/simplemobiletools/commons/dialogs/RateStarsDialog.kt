package com.simplemobiletools.commons.dialogs

import android.app.Activity
import android.widget.ImageView
import android.widget.ScrollView
import androidx.appcompat.app.AlertDialog
import com.simplemobiletools.commons.R
import com.simplemobiletools.commons.extensions.*

class RateStarsDialog(val activity: Activity) {
    private var dialog: AlertDialog? = null

    init {
        val view = activity.layoutInflater.inflate(R.layout.dialog_rate_stars, null).apply {
            val primaryColor = activity.getProperPrimaryColor()
            arrayOf(findViewById<ImageView>(R.id.rate_star_1), findViewById<ImageView>(R.id.rate_star_2), findViewById<ImageView>(R.id.rate_star_3), findViewById<ImageView>(R.id.rate_star_4), findViewById<ImageView>(R.id.rate_star_5)).forEach {
                it.applyColorFilter(primaryColor)
            }

            findViewById<ImageView>(R.id.rate_star_1).setOnClickListener { dialogCancelled(true) }
            findViewById<ImageView>(R.id.rate_star_2).setOnClickListener { dialogCancelled(true) }
            findViewById<ImageView>(R.id.rate_star_3).setOnClickListener { dialogCancelled(true) }
            findViewById<ImageView>(R.id.rate_star_4).setOnClickListener { dialogCancelled(true) }
            findViewById<ImageView>(R.id.rate_star_5).setOnClickListener {
                activity.redirectToRateUs()
                dialogCancelled(true)
            }
        }

        activity.getAlertDialogBuilder()
            .setNegativeButton(R.string.later) { dialog, which -> dialogCancelled(false) }
            .setOnCancelListener { dialogCancelled(false) }
            .apply {
                activity.setupDialogStuff(view, this, cancelOnTouchOutside = false) { alertDialog ->
                    dialog = alertDialog
                }
            }
    }

    private fun dialogCancelled(showThankYou: Boolean) {
        dialog?.dismiss()
        if (showThankYou) {
            activity.toast(R.string.thank_you)
            activity.baseConfig.wasAppRated = true
        }
    }
}
