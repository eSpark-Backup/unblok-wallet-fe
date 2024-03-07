package com.simplemobiletools.keyboard.helpers

import android.annotation.SuppressLint
import android.content.Context
import android.content.res.Resources
import android.content.res.TypedArray
import android.content.res.XmlResourceParser
import android.graphics.drawable.Drawable
import android.util.Log
import android.util.TypedValue
import android.util.Xml
import android.view.inputmethod.EditorInfo
import android.view.inputmethod.EditorInfo.IME_ACTION_NONE
import androidx.annotation.XmlRes
import com.unblock.R
import com.simplemobiletools.keyboard.extensions.config
import kotlin.math.roundToInt

class MyKeyboard {
    private var mDefaultHorizontalGap = 0
    private var mDefaultWidth = 0
    private var mDefaultHeight = 0
    private var mDefaultVerticalGap = 0  // Added vertical gap attribute

    var mKeyboardHeightMultiplier: Float = 1F
    var mShiftState = ShiftState.OFF
    var mspaceClick = false
    var mHeight = 0
    var mMinWidth = 0
    var mKeys: MutableList<Key?>? = null
    private var mDisplayWidth = 0
    private var mDisplayHeight = 0
    private var mEnterKeyType = IME_ACTION_NONE
    private val mRows = ArrayList<Row?>()

    companion object {
        private const val TAG_KEYBOARD = "Keyboard"
        private const val TAG_ROW = "Row"
        private const val TAG_KEY = "Key"
        private const val EDGE_LEFT = 0x01
        private const val EDGE_RIGHT = 0x02
        const val KEYCODE_SHIFT = -1
        const val KEYCODE_MODE_CHANGE = -2
        const val KEYCODE_ENTER = -4
        const val KEYCODE_DELETE = -5
        const val KEYCODE_SPACE = 32
        const val KEYCODE_SPACE_N = 323
        const val KEYCODE_EMOJI = -6
        const val KEYCODE_123 = -2
        const val KEYCODE_SLASH = 47
        const val KEYCODE_DOT = 46
        const val KEYCODE_COMMA = 44

        fun getDimensionOrFraction(a: TypedArray, index: Int, base: Int, defValue: Int): Int {
            val value = a.peekValue(index) ?: return defValue
            return when (value.type) {
                TypedValue.TYPE_DIMENSION -> a.getDimensionPixelOffset(index, defValue)
                TypedValue.TYPE_FRACTION -> Math.round(a.getFraction(index, base, base, defValue.toFloat()))
                else -> defValue
            }
        }
    }

    class Row {
        var defaultWidth = 0
        var defaultHeight = 0
        var defaultHorizontalGap = 0
        var defaultVerticalGap = 0 // Added vertical gap attribute
        var mKeys = ArrayList<Key>()
        var parent: MyKeyboard
        var isNumbersRow: Boolean = false

        constructor(parent: MyKeyboard) {
            this.parent = parent
        }

        constructor(res: Resources, parent: MyKeyboard, parser: XmlResourceParser?) {
            this.parent = parent
            val a = res.obtainAttributes(Xml.asAttributeSet(parser), R.styleable.MyKeyboard)
            defaultWidth = getDimensionOrFraction(a, R.styleable.MyKeyboard_keyWidth, parent.mDisplayWidth, parent.mDefaultWidth)
            Log.d("Default Width:",""+defaultWidth)
            defaultHeight = (res.getDimension(R.dimen.key_height) * this.parent.mKeyboardHeightMultiplier).roundToInt()
            defaultHorizontalGap = getDimensionOrFraction(a, R.styleable.MyKeyboard_horizontalGap, parent.mDisplayWidth, parent.mDefaultHorizontalGap)
            defaultVerticalGap = getDimensionOrFraction(a, R.styleable.MyKeyboard_verticalGap, parent.mDisplayWidth, parent.mDefaultVerticalGap)  // Added vertical gap attribute
            isNumbersRow = a.getBoolean(R.styleable.MyKeyboard_isNumbersRow, false)
            a.recycle()
        }
    }

    class Key(parent: Row) {
        var code = 0
        var label: CharSequence = ""
        var topSmallNumber: String = ""
        var icon: Drawable? = null
        var secondaryIcon: Drawable? = null
        var width: Int
        var height: Int
        var gap: Int
        var x = 0
        var y = 0
        var pressed = false
        var focused = false
        var popupCharacters: CharSequence? = null
        private var edgeFlags = 0
        private val keyboard = parent.parent
        var popupResId = 0
        var repeatable = false

        constructor(res: Resources, parent: Row, x: Int, y: Int, parser: XmlResourceParser?) : this(parent) {
            this.x = x
            this.y = y
            var a = res.obtainAttributes(Xml.asAttributeSet(parser), R.styleable.MyKeyboard)
            width = getDimensionOrFraction(a, R.styleable.MyKeyboard_keyWidth, keyboard.mDisplayWidth, parent.defaultWidth)
            height = parent.defaultHeight
            gap = getDimensionOrFraction(a, R.styleable.MyKeyboard_horizontalGap, keyboard.mDisplayWidth, parent.defaultHorizontalGap)
            this.x += gap
            a.recycle()
            a = res.obtainAttributes(Xml.asAttributeSet(parser), R.styleable.MyKeyboard_Key)
            label = a.getText(R.styleable.MyKeyboard_Key_keyLabel) ?: ""
            code = a.getInt(R.styleable.MyKeyboard_Key_code, 0)
            if (label.isNotEmpty() && code == 0) {
                code = label[0].code
            }
            popupCharacters = a.getText(R.styleable.MyKeyboard_Key_popupCharacters)
            popupResId = a.getResourceId(R.styleable.MyKeyboard_Key_popupKeyboard, 0)
            repeatable = a.getBoolean(R.styleable.MyKeyboard_Key_isRepeatable, false)
            edgeFlags = a.getInt(R.styleable.MyKeyboard_Key_keyEdgeFlags, 0)
            icon = a.getDrawable(R.styleable.MyKeyboard_Key_keyIcon)
            icon?.setBounds(0, 0, icon!!.intrinsicWidth, icon!!.intrinsicHeight)
            secondaryIcon = a.getDrawable(R.styleable.MyKeyboard_Key_secondaryKeyIcon)
            secondaryIcon?.setBounds(0, 0, secondaryIcon!!.intrinsicWidth, secondaryIcon!!.intrinsicHeight)
            topSmallNumber = a.getString(R.styleable.MyKeyboard_Key_topSmallNumber) ?: ""
            a.recycle()
        }

        init {
            height = parent.defaultHeight
            width = parent.defaultWidth
            gap = parent.defaultHorizontalGap
        }

        fun isInside(x: Int, y: Int): Boolean {
            val leftEdge = edgeFlags and EDGE_LEFT > 0
            val rightEdge = edgeFlags and EDGE_RIGHT > 0
            return (
                    (x >= this.x || leftEdge && x <= this.x + width) &&
                            (x < this.x + width || rightEdge && x >= this.x) &&
                            (y >= this.y && y <= this.y + height) &&
                            (y < this.y + height && y >= this.y)
                    )
        }
    }

    @JvmOverloads
    constructor(context: Context, @XmlRes xmlLayoutResId: Int, enterKeyType: Int, shiftState: ShiftState = ShiftState.OFF) {
        mDisplayWidth = context.resources.displayMetrics.widthPixels
        mDefaultHorizontalGap = 0
        mDefaultWidth = mDisplayWidth / 10
        mDefaultHeight = mDefaultWidth
        mDefaultVerticalGap = 0  // Added vertical gap attribute
        mKeyboardHeightMultiplier = getKeyboardHeightMultiplier(context.config.keyboardHeightMultiplier)
        mKeys = ArrayList()
        mShiftState = shiftState
        mEnterKeyType = enterKeyType
        loadKeyboard(context, context.resources.getXml(xmlLayoutResId))
    }

    constructor(context: Context, layoutTemplateResId: Int, characters: CharSequence, keyWidth: Int) :
            this(context, layoutTemplateResId, 0) {
        var x = 0
        var y = 0
        var column = 0
        mMinWidth = 0
        val row = Row(this)
        row.defaultHeight = mDefaultHeight
        row.defaultWidth = keyWidth
        row.defaultHorizontalGap = mDefaultHorizontalGap
        row.defaultVerticalGap = mDefaultVerticalGap  // Added vertical gap attribute
        mKeyboardHeightMultiplier = getKeyboardHeightMultiplier(context.config.keyboardHeightMultiplier)

        characters.forEachIndexed { index, character ->
            val key = Key(row)
            if (column >= MAX_KEYS_PER_MINI_ROW) {
                column = 0
                x = 0
                y += mDefaultHeight
                mRows.add(row)
                row.mKeys.clear()
            }

            key.x = x
            key.y = y
            key.label = character.toString()
            key.code = character.code
            column++
            x += key.width + key.gap
            mKeys!!.add(key)
            row.mKeys.add(key)
            if (x > mMinWidth) {
                mMinWidth = x
            }
        }
        mHeight = y + mDefaultHeight
        mRows.add(row)
    }

    fun setShifted(shiftState: ShiftState): Boolean {
        if (this.mShiftState != shiftState) {
            this.mShiftState = shiftState
            return true
        }
        return false
    }

    private fun createRowFromXml(res: Resources, parser: XmlResourceParser?): Row {
        return Row(res, this, parser)
    }

    private fun createKeyFromXml(res: Resources, parent: Row, x: Int, y: Int, parser: XmlResourceParser?): Key {
        return Key(res, parent, x, y, parser)
    }

    @SuppressLint("UseCompatLoadingForDrawables")
    private fun loadKeyboard(context: Context, parser: XmlResourceParser) {
        var inKey = false
        var inRow = false
        var row = 0
        var x = 0
        var y = 0
        var key: Key? = null
        var currentRow: Row? = null
        val res = context.resources
        try {
            var event: Int
            while (parser.next().also { event = it } != XmlResourceParser.END_DOCUMENT) {
                if (event == XmlResourceParser.START_TAG) {
                    when (parser.name) {
                        TAG_ROW -> {
                            currentRow = createRowFromXml(res, parser)
                            if (currentRow.isNumbersRow && !context.config.showNumbersRow) {
                                continue
                            }
                            inRow = true
                            x = 0
                            mRows.add(currentRow)
                        }

                        TAG_KEY -> {
                            if (currentRow?.isNumbersRow == true && !context.config.showNumbersRow) {
                                continue
                            }
                            inKey = true
                            key = createKeyFromXml(res, currentRow!!, x, y, parser)
                            if (context.config.showNumbersRow) {
                                key.apply {
                                    popupCharacters = popupCharacters?.replace(Regex("\\d+"), "")
                                    if (popupCharacters.isNullOrEmpty()) {
                                        popupResId = 0
                                    }
                                }
                            }
                            mKeys!!.add(key)
                            if (key.code == KEYCODE_ENTER) {
                                val enterResourceId = when (mEnterKeyType) {
                                    EditorInfo.IME_ACTION_SEARCH -> R.drawable.ic_send
                                    EditorInfo.IME_ACTION_NEXT, EditorInfo.IME_ACTION_GO -> R.drawable.ic_send
                                    EditorInfo.IME_ACTION_SEND -> R.drawable.ic_send
                                    else -> R.drawable.ic_send
                                }
                                key.icon = context.resources.getDrawable(enterResourceId, context.theme)
                            }
                            currentRow.mKeys.add(key)
                        }

                        TAG_KEYBOARD -> {
                            parseKeyboardAttributes(res, parser)
                        }
                    }
                } else if (event == XmlResourceParser.END_TAG) {
                    if (inKey) {
                        inKey = false
                        x += key!!.gap + key.width
                        if (x > mMinWidth) {
                            mMinWidth = x
                        }
                    } else if (inRow) {
                        inRow = false
                        y += currentRow!!.defaultHeight + currentRow.defaultVerticalGap  // Include vertical gap between rows
                        row++
                    }
                }
            }
        } catch (e: Exception) {
        }
        mHeight = y
    }

    private fun parseKeyboardAttributes(res: Resources, parser: XmlResourceParser) {
        val a = res.obtainAttributes(Xml.asAttributeSet(parser), R.styleable.MyKeyboard)
        mDefaultWidth = getDimensionOrFraction(a, R.styleable.MyKeyboard_keyWidth, mDisplayWidth, mDisplayWidth / 10)
        mDefaultHeight = res.getDimension(R.dimen.key_height).toInt()
        mDefaultHorizontalGap = getDimensionOrFraction(a, R.styleable.MyKeyboard_horizontalGap, mDisplayWidth, 0)
        mDefaultVerticalGap = getDimensionOrFraction(a, R.styleable.MyKeyboard_verticalGap, mDefaultHeight, 0)  // Added vertical gap attribute
        a.recycle()
    }

    private fun getKeyboardHeightMultiplier(multiplierType: Int): Float {
        return when (multiplierType) {
            KEYBOARD_HEIGHT_MULTIPLIER_SMALL -> 1.0F
            KEYBOARD_HEIGHT_MULTIPLIER_MEDIUM -> 1.2F
            KEYBOARD_HEIGHT_MULTIPLIER_LARGE -> 1.4F
            else -> 1.0F
        }
    }
}
