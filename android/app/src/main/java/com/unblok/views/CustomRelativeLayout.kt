package com.unblok.views

import android.content.Context
import android.util.AttributeSet
import android.util.Log
import android.view.Gravity
import android.view.ViewGroup
import android.view.inputmethod.ExtractedTextRequest
import android.view.inputmethod.InputConnection
import android.widget.RelativeLayout
import android.widget.TextView
import com.unblok.services.SimpleKeyboardIME


public class CustomRelativeLayout : RelativeLayout {
    constructor(context: Context?) : super(context) {
        init()
    }

    constructor(context: Context?, attrs: AttributeSet?) : super(context, attrs) {
        init()
    }

    constructor(context: Context?, attrs: AttributeSet?, defStyle: Int) : super(context, attrs, defStyle) {
        init()
    }
    fun modifyEditorInfo(inputConnection: InputConnection) {
        Log.d("Data:","Krish IN")
        var data = inputConnection.getExtractedText(ExtractedTextRequest(),0);
        Log.d("Data:",""+data)
        Log.d("InputConnection",""+inputConnection)
    }
    private fun init() {
        for (i in 0 until 10) {
            val textView = TextView(context)
            textView.text = "TextView ${i + 1}"
            textView.id = i + 1 // Set a unique ID for each TextView
            val params = RelativeLayout.LayoutParams(
                    ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT
            )
            textView.layoutParams = params
            if (i == 0) {
                params.addRule(RelativeLayout.ALIGN_PARENT_LEFT)
            } else {
                params.addRule(RelativeLayout.RIGHT_OF, i)
            }
            textView.gravity = Gravity.CENTER
            addView(textView)
        }
    }
}
