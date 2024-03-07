package com.simplemobiletools.commons.dialogs

import android.app.Activity
import android.content.res.Resources
import android.net.Uri
import android.os.Environment
import android.provider.MediaStore
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import com.simplemobiletools.commons.R
import com.simplemobiletools.commons.extensions.*
import com.simplemobiletools.commons.helpers.*
import com.simplemobiletools.commons.views.MyTextView
import java.util.*

abstract class BasePropertiesDialog(activity: Activity) {
    protected val mInflater: LayoutInflater
    protected val mPropertyView: ViewGroup
    protected val mResources: Resources
    protected val mActivity: Activity = activity
    protected val mDialogView: View

    init {
        mInflater = LayoutInflater.from(activity)
        mResources = activity.resources
        mDialogView = mInflater.inflate(R.layout.dialog_properties, null)
        mPropertyView = mDialogView.findViewById<LinearLayout>(R.id.properties_holder)!!
    }

    protected fun addProperty(labelId: Int, value: String?, viewId: Int = 0) {
        if (value == null) {
            return
        }

        mInflater.inflate(R.layout.item_property, mPropertyView, false).apply {
            findViewById<MyTextView>(R.id.property_value).setTextColor(mActivity.getProperTextColor())
            findViewById<MyTextView>(R.id.property_label).setTextColor(mActivity.getProperTextColor())

            findViewById<MyTextView>(R.id.property_label).text = mResources.getString(labelId)
            findViewById<MyTextView>(R.id.property_value).text = value
            mPropertyView.findViewById<LinearLayout>(R.id.properties_holder).addView(this)

            setOnLongClickListener {
                mActivity.copyToClipboard(findViewById<MyTextView>(R.id.property_value).value)
                true
            }

            if (labelId == R.string.gps_coordinates) {
                setOnClickListener {
                    mActivity.showLocationOnMap(value)
                }
            }

            if (viewId != 0) {
                id = viewId
            }
        }
    }
}
