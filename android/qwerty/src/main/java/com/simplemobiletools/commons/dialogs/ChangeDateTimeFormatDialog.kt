package com.simplemobiletools.commons.dialogs

import android.app.Activity
import android.text.format.DateFormat
import android.widget.ImageView
import com.simplemobiletools.commons.R
import com.simplemobiletools.commons.R.id.*
import com.simplemobiletools.commons.extensions.baseConfig
import com.simplemobiletools.commons.extensions.getAlertDialogBuilder
import com.simplemobiletools.commons.extensions.setupDialogStuff
import com.simplemobiletools.commons.helpers.*
import com.simplemobiletools.commons.views.MyAppCompatCheckbox
import com.simplemobiletools.commons.views.MyCompatRadioButton
import java.util.*

class ChangeDateTimeFormatDialog(val activity: Activity, val callback: () -> Unit) {
    private val view = activity.layoutInflater.inflate(R.layout.dialog_change_date_time_format, null)!!
    private val sampleTS = 1613422500000    // February 15, 2021

    init {
        view.apply {
            findViewById<MyCompatRadioButton>(change_date_time_dialog_radio_one).text = formatDateSample(DATE_FORMAT_ONE)
            findViewById<MyCompatRadioButton>(change_date_time_dialog_radio_two).text = formatDateSample(DATE_FORMAT_TWO)
            findViewById<MyCompatRadioButton>(change_date_time_dialog_radio_three).text = formatDateSample(DATE_FORMAT_THREE)
            findViewById<MyCompatRadioButton>(change_date_time_dialog_radio_four).text = formatDateSample(DATE_FORMAT_FOUR)
            findViewById<MyCompatRadioButton>(change_date_time_dialog_radio_five).text = formatDateSample(DATE_FORMAT_FIVE)
            findViewById<MyCompatRadioButton>(change_date_time_dialog_radio_six).text = formatDateSample(DATE_FORMAT_SIX)
            findViewById<MyCompatRadioButton>(change_date_time_dialog_radio_seven).text = formatDateSample(DATE_FORMAT_SEVEN)
            findViewById<MyCompatRadioButton>(change_date_time_dialog_radio_eight).text = formatDateSample(DATE_FORMAT_EIGHT)

            findViewById<MyAppCompatCheckbox>(change_date_time_dialog_24_hour).isChecked = activity.baseConfig.use24HourFormat

            val formatButton = when (activity.baseConfig.dateFormat) {
                DATE_FORMAT_ONE -> change_date_time_dialog_radio_one
                DATE_FORMAT_TWO -> change_date_time_dialog_radio_two
                DATE_FORMAT_THREE -> change_date_time_dialog_radio_three
                DATE_FORMAT_FOUR -> change_date_time_dialog_radio_four
                DATE_FORMAT_FIVE -> change_date_time_dialog_radio_five
                DATE_FORMAT_SIX -> change_date_time_dialog_radio_six
                DATE_FORMAT_SEVEN -> change_date_time_dialog_radio_seven
                else -> change_date_time_dialog_radio_eight
            }
//            formatButton.isChecked = true
        }

//        activity.getAlertDialogBuilder()
//            .setPositiveButton(R.string.ok) { dialog, which -> dialogConfirmed() }
//            .setNegativeButton(R.string.cancel, null)
//            .apply {
//                activity.setupDialogStuff(view, this)
//            }
    }

//    private fun dialogConfirmed() {
//        activity.baseConfig.dateFormat = when (view.findViewById<MyCompatRadioButton>(change_date_time_dialog_radio_eight).checkedRadioButtonId) {
//            change_date_time_dialog_radio_one -> DATE_FORMAT_ONE
//            change_date_time_dialog_radio_two -> DATE_FORMAT_TWO
//            change_date_time_dialog_radio_three -> DATE_FORMAT_THREE
//            change_date_time_dialog_radio_four -> DATE_FORMAT_FOUR
//            change_date_time_dialog_radio_five -> DATE_FORMAT_FIVE
//            change_date_time_dialog_radio_six -> DATE_FORMAT_SIX
//            change_date_time_dialog_radio_seven -> DATE_FORMAT_SEVEN
//            else -> DATE_FORMAT_EIGHT
//        }
//
//        activity.baseConfig.use24HourFormat = view.change_date_time_dialog_24_hour.isChecked
//        callback()
//    }

    private fun formatDateSample(format: String): String {
        val cal = Calendar.getInstance(Locale.ENGLISH)
        cal.timeInMillis = sampleTS
        return DateFormat.format(format, cal).toString()
    }
}
