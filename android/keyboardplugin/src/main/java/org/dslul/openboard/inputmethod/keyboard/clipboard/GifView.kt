package org.dslul.openboard.inputmethod.keyboard.clipboard

import android.content.Context
import android.util.AttributeSet
import android.util.TypedValue
import android.view.MotionEvent
import android.view.View
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.TextView
import org.dslul.openboard.inputmethod.keyboard.KeyboardActionListener
import org.dslul.openboard.inputmethod.keyboard.internal.KeyDrawParams
import org.dslul.openboard.inputmethod.latin.ClipboardHistoryManager
import org.dslul.openboard.inputmethod.latin.R
import org.dslul.openboard.inputmethod.latin.common.Constants
import org.dslul.openboard.inputmethod.latin.utils.ResourceUtils

class GifView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet?,
    defStyle: Int = R.attr.clipboardHistoryViewStyle
) : LinearLayout(context, attrs, defStyle), View.OnTouchListener, View.OnClickListener {

    private val clipboardLayoutParams = ClipboardLayoutParams(context.resources)
    private val pinIconId: Int
    private val dividerColor: Int
    private val functionalKeyBackgroundId: Int
    private val keyBackgroundId: Int

    private lateinit var search: EditText
    private lateinit var alphabetKey: TextView

    var keyboardActionListener: KeyboardActionListener? = null
    var clipboardHistoryManager: ClipboardHistoryManager? = null

    init {
        val clipboardViewAttr = context.obtainStyledAttributes(
            attrs,
            R.styleable.ClipboardHistoryView, defStyle, R.style.ClipboardHistoryView
        )
        pinIconId = clipboardViewAttr.getResourceId(
            R.styleable.ClipboardHistoryView_iconPinnedClip, 0
        )
        dividerColor = clipboardViewAttr.getColor(
            R.styleable.ClipboardHistoryView_dividerBackground, 0
        )
        clipboardViewAttr.recycle()
        val keyboardViewAttr = context.obtainStyledAttributes(
            attrs,
            R.styleable.KeyboardView, defStyle, R.style.KeyboardView
        )
        keyBackgroundId = keyboardViewAttr.getResourceId(
            R.styleable.KeyboardView_keyBackground, 0
        )
        functionalKeyBackgroundId = keyboardViewAttr.getResourceId(
            R.styleable.KeyboardView_functionalKeyBackground, keyBackgroundId
        )
        keyboardViewAttr.recycle()
    }

    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec)
        val res = context.resources
        // The main keyboard expands to the entire this {@link KeyboardView}.
        val width = (ResourceUtils.getDefaultKeyboardWidth(res)
                + paddingLeft + paddingRight)
        val height = (ResourceUtils.getDefaultKeyboardHeight(res)
                + res.getDimensionPixelSize(R.dimen.config_suggestions_strip_height)
                + paddingTop + paddingBottom)
        setMeasuredDimension(width, height)
    }

    override fun onFinishInflate() {
        super.onFinishInflate()
        alphabetKey = findViewById<TextView>(R.id.clipboard_keyboard_alphabet).apply {
            tag = Constants.CODE_ALPHA_FROM_CLIPBOARD
            setBackgroundResource(functionalKeyBackgroundId)
            setOnTouchListener(this@GifView)
            setOnClickListener(this@GifView)
        }
        search = findViewById<EditText>(R.id.search_view).apply {
            tag = Constants.CODE_ALPHA_FROM_CLIPBOARD
            setOnTouchListener(this@GifView)
            setOnClickListener(this@GifView)
        }

    }

    private fun setupAlphabetKey(key: TextView?, label: String, params: KeyDrawParams) {
        key?.apply {
            text = label
            typeface = params.mTypeface
            setTextColor(params.mFunctionalTextColor)
            setTextSize(TypedValue.COMPLEX_UNIT_PX, params.mLabelSize.toFloat())
        }
    }


    fun setHardwareAcceleratedDrawingEnabled(enabled: Boolean) {
        if (!enabled) return
        // TODO: Should use LAYER_TYPE_SOFTWARE when hardware acceleration is off?
        setLayerType(LAYER_TYPE_HARDWARE, null)
    }

    override fun onTouch(view: View, event: MotionEvent): Boolean {
        if (event.actionMasked != MotionEvent.ACTION_DOWN) {
            return false
        }
        when (view) {
            alphabetKey -> keyboardActionListener?.onPressKey(
                Constants.CODE_ALPHA_FROM_CLIPBOARD, 0 /* repeatCount */,
                true /* isSinglePointer */
            )

            search -> keyboardActionListener?.onPressKey(
                Constants.CODE_ALPHA_FROM_GIF, 0 /* repeatCount */,
                true /* isSinglePointer */
            )
        }
        // It's important to return false here. Otherwise, {@link #onClick} and touch-down visual
        // feedback stop working.
        return false
    }

    override fun onClick(view: View) {
        when (view) {
            alphabetKey -> {
                keyboardActionListener?.onCodeInput(
                    Constants.CODE_ALPHA_FROM_CLIPBOARD,
                    Constants.NOT_A_COORDINATE, Constants.NOT_A_COORDINATE,
                    false /* isKeyRepeat */
                )
                keyboardActionListener?.onReleaseKey(
                    Constants.CODE_ALPHA_FROM_CLIPBOARD,
                    false /* withSliding */
                )
            }

            search -> {
                keyboardActionListener?.onCodeInput(
                    Constants.CODE_ALPHA_FROM_GIF,
                    Constants.NOT_A_COORDINATE, Constants.NOT_A_COORDINATE,
                    false /* isKeyRepeat */
                )
                keyboardActionListener?.onReleaseKey(
                    Constants.CODE_ALPHA_FROM_GIF,
                    false /* withSliding */
                )
            }
        }
    }

}