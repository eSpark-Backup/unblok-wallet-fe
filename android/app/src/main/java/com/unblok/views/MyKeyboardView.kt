package com.simplemobiletools.keyboard.views


import android.annotation.SuppressLint
import android.content.*
import android.graphics.*
import android.graphics.Paint.Align
import android.graphics.drawable.*
import android.net.Uri
import android.os.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.util.AttributeSet
import android.util.Log
import android.util.TypedValue
import android.view.*
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityManager
import android.view.inputmethod.EditorInfo
import android.view.inputmethod.InputConnection
import android.widget.*
import androidx.appcompat.widget.LinearLayoutCompat
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.emoji2.text.EmojiCompat
import androidx.emoji2.text.EmojiCompat.EMOJI_SUPPORTED
import com.airbnb.lottie.LottieAnimationView
import com.facebook.react.bridge.UiThreadUtil.runOnUiThread
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.simplemobiletools.commons.extensions.*
import com.simplemobiletools.commons.helpers.ensureBackgroundThread
import com.simplemobiletools.commons.helpers.isPiePlus
import com.simplemobiletools.commons.views.MyRecyclerView
import com.simplemobiletools.keyboard.adapters.ClipsKeyboardAdapter
import com.simplemobiletools.keyboard.adapters.EmojisAdapter
import com.simplemobiletools.keyboard.dialogs.ChangeLanguagePopup
import com.simplemobiletools.keyboard.extensions.*
import com.simplemobiletools.keyboard.helpers.*
import com.simplemobiletools.keyboard.helpers.MyKeyboard.Companion.KEYCODE_123
import com.simplemobiletools.keyboard.helpers.MyKeyboard.Companion.KEYCODE_COMMA
import com.simplemobiletools.keyboard.helpers.MyKeyboard.Companion.KEYCODE_DELETE
import com.simplemobiletools.keyboard.helpers.MyKeyboard.Companion.KEYCODE_DOT
import com.simplemobiletools.keyboard.helpers.MyKeyboard.Companion.KEYCODE_EMOJI
import com.simplemobiletools.keyboard.helpers.MyKeyboard.Companion.KEYCODE_ENTER
import com.simplemobiletools.keyboard.helpers.MyKeyboard.Companion.KEYCODE_MODE_CHANGE
import com.simplemobiletools.keyboard.helpers.MyKeyboard.Companion.KEYCODE_SHIFT
import com.simplemobiletools.keyboard.helpers.MyKeyboard.Companion.KEYCODE_SPACE
import com.simplemobiletools.keyboard.helpers.MyKeyboard.Companion.KEYCODE_SPACE_N
import com.simplemobiletools.keyboard.interfaces.RefreshClipsListener
import com.simplemobiletools.keyboard.models.Clip
import com.simplemobiletools.keyboard.models.ClipsSectionLabel
import com.simplemobiletools.keyboard.models.ListItem
import com.simplemobiletools.keyboard.models.RecentClip
import com.unblock.R
import com.unblok.*
import com.unblok.ApiClient.GIFStickerApiClient
import com.unblok.ApiService.GiphyApiService
import com.unblok.ApiService.GiphyGIFApiService
import com.unblok.adapters.EmojiAdapter
import com.unblok.adapters.EmojiCategory
import com.unblok.adapters.GIFAdapter
import com.unblok.adapters.StickerAdapter
import com.unblok.dialogs.CustomKeyboardService
import com.unblok.helpers.PermissionHelper
import com.unblok.interfaces.TenorService
import com.unblok.services.SimpleKeyboardIME
import kotlinx.coroutines.*
import okhttp3.*
import org.json.JSONObject
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.GET
import retrofit2.http.Query
import java.io.IOException
import java.util.*


@SuppressLint("UseCompatLoadingForDrawables", "ClickableViewAccessibility")
class MyKeyboardView @JvmOverloads constructor(
        context: Context, attrs: AttributeSet?, defStyleRes: Int = 0
) : View(context, attrs, defStyleRes) {

    interface OnKeyboardActionListener {
        /**
         * Called when the user presses a key. This is sent before the [.onKey] is called. For keys that repeat, this is only called once.
         * @param primaryCode the unicode of the key being pressed. If the touch is not on a valid key, the value will be zero.
         */
        fun onPress(primaryCode: Int)

        /**
         * Send a key press to the listener.
         * @param code this is the key that was pressed
         */
        fun onKey(code: Int)

        /**
         * Called when the finger has been lifted after pressing a key
         */
        fun onActionUp()

        /**
         * Called when the user long presses Space and moves to the left
         */
        fun moveCursorLeft()

        /**
         * Called when the user long presses Space and moves to the right
         */
        fun moveCursorRight()

        /**
         * Sends a sequence of characters to the listener.
         * @param text the string to be displayed.
         */
        fun onText(text: String)

        /**
         * Called to force the KeyboardView to reload the keyboard
         */
        fun reloadKeyboard()

        fun commitGifImage(contentUri: Uri, imageDescription: String)

        fun onUpdateSelection(
                oldSelStart: Int,
                oldSelEnd: Int,
                newSelStart: Int,
                newSelEnd: Int,
                candidatesStart: Int,
                candidatesEnd: Int
        )

        fun ClearConnection()
        fun onSearchClicked(enabled: Boolean)
        fun onSearchText(text: String)

    }

    interface InputConnectionListener {
        fun onInputConnectionReceived(inputConnection: InputConnection)
    }


    private var mKeyboard: MyKeyboard? = null
    private var mCurrentKeyIndex: Int = NOT_A_KEY
    private var sharedPreferences: SharedPreferences
    private var mLabelTextSize = 0
    private var recentClips: ArrayList<String> = ArrayList()
    private var mKeyTextSize = 0
    private var keyboardStatus = ""
    private var mTextColor = 0
    private var mIconColor = 0
    private var speechRecognizer: SpeechRecognizer? = null
    private var Suggestions: List<WordSuggestion> = emptyList()
    private var mBackgroundColor = 0
    private var mBackgroundBarColor = 0
    private var mPrimaryColor = 0
    private var mKeyColor = 0
    private var mKeyColorPressed = 0
    private var mPreviewText: TextView? = null
    private val mPreviewPopup: PopupWindow
    private var mPreviewTextSizeLarge = 0
    private var mPreviewHeight = 0
    private val mCoordinates = IntArray(2)
    private val mPopupKeyboard: PopupWindow
    private var mMiniKeyboardContainer: View? = null
    private var mMiniKeyboard: MyKeyboardView? = null
    private var emojiAdapter: EmojiAdapter? = null
    private var mMiniKeyboardOnScreen = false
    private var mPopupParent: View
    private var mLottieAnimation: LottieAnimationView? = null
    private var mMiniKeyboardOffsetX = 0
    private var mMiniKeyboardOffsetY = 0
    private val mMiniKeyboardCache: MutableMap<MyKeyboard.Key, View?>
    private var mKeys = ArrayList<MyKeyboard.Key>()
    private var mMiniKeyboardSelectedKeyIndex = -1
    var mOnKeyboardActionListener: OnKeyboardActionListener? = null
    var mOnKeyboardInputConnection: InputConnectionListener? = null
    private var mVerticalCorrection = 0
    private var mProximityThreshold = 0
    private var mPopupPreviewX = 0
    private var mPopupPreviewY = 0
    private var mLastX = 0
    private var mLastY = 0
    private val mPaint: Paint
    private var mDownTime = 0L
    private var mLastMoveTime = 0L
    private var mLastKey = 0
    private var mLastCodeX = 0
    private var mLastCodeY = 0
    private var mLastKeyPressedCode = 0
    private var mCurrentKey: Int = NOT_A_KEY
    private var mLastKeyTime = 0L
    private var mCurrentKeyTime = 0L
    private val mKeyIndices = IntArray(12)
    private var mPopupX = 0
    private var mPopupY = 0
    private var mRepeatKeyIndex = NOT_A_KEY
    private var mPopupLayout = 0
    private var mAbortKey = false
    private var mIsLongPressingSpace = false
    private var mLastSpaceMoveX = 0
    private var mPopupMaxMoveDistance = 0f
    private var mTopSmallNumberSize = 0f
    private var mTopSmallNumberMarginWidth = 0f
    private var mTopSmallNumberMarginHeight = 0f
    private val mSpaceMoveThreshold: Int
    private var ignoreTouches = false
    private var stickers: List<Datum> = emptyList()
    private var gifs: List<Datum> = emptyList()
    private var recentEmojis: MutableList<String> = mutableListOf()
    private var recentlyUsedEmojis = LinkedHashSet<String>()
    private var wordBeforeCursor: String = ""

    //    private var keyboardListener: KeyboardListener? = null
    private var print_sugg2: String = " "
    private var print_sugg1: String = " "
    private var print_sugg3: String = " "
    private var print_sugg4: String = " "
    private var print_sugg5: String = " "
    private var print_sugg6: String = " "
    private var print_sugg7: String = " "
    private var print_sugg8: String = " "
    private var print_sugg9: String = " "
    private var print_sugg10: String = " "
    private var inputConnectionListener: InputConnectionListener? = null


    private var mKeyBackground: Drawable? = null
    private var mShowKeyBorders: Boolean = false
    private var mUsingSystemTheme: Boolean = true
    private var mUsingMic: Boolean = false
    private var mUsingDarkTheme: Boolean = true
    private var mUsingWhiteTheme: Boolean = true
    private var simpleKeyboard: SimpleKeyboardIME? = null

    // private var currentInputconnection: InputConnection? = null
    private var mToolbarHolder: View? = null
    private var mToolHolder: View? = null
    private var mSuggEmojiHolder: View? = null
    private var mSearchStickerHolder: View? = null
    private var mSearchHolder: View? = null
    private var mSuggHolder: View? = null
    private var mMicHolder: View? = null
    private var analyzed_text: String = " "
    private var mClipboardManagerHolder: View? = null
    private var mEmojiPaletteHolder: View? = null
    private var mStickerPaletteHolder: View? = null
    private var mGIFPaletteHolder: View? = null
    private var emojiCompatMetadataVersion = 0
    private var currentCategoryIndex = 0
    private var CustomKeyboardService: CustomKeyboardService? = null
    private var inputconnection: InputConnection? = null
    val smileEmojis = listOf(
            "😀",
            "😃",
            "😄",
            "😁",
            "😆",
            "😅",
            "🤣",
            "😂",
            "🙂",
            "🙃",
            "🫠",
            "😉",
            "😊",
            "😇",
            "🥰",
            "😍",
            "🤩",
            "😘",
            "😗",
            "☺️",
            "😚",
            "😙",
            "🥲",
            "😋",
            "😛",
            "😜",
            "🤪",
            "😝",
            "🤑",
            "🤗",
            "🤭",
            "🫢",
            "🫣",
            "🤫",
            "🤔",
            "🫡",
            "🤐",
            "🤨",
            "😐",
            "😑",
            "😶",
            "🫥",
            "😶‍🌫️",
            "😏",
            "😒",
            "🙄",
            "😬",
            "😮‍💨",
            "🤥",
            "😌",
            "😔",
            "😪",
            "🤤",
            "😴",
            "😷",
            "🤒",
            "🤕",
            "🤢",
            "🤮",
            "🤧",
            "🥵",
            "🥶",
            "🥴",
            "😵",
            "😵‍💫",
            "🤯",
            "🤠",
            "🥳",
            "🥸",
            "😎",
            "🤓",
            "🧐",
            "😕",
            "🫤",
            "😟",
            "🙁",
            "☹️",
            "😮",
            "😯",
            "😲",
            "😳",
            "🥺",
            "🥹",
            "😦",
            "😧",
            "😨",
            "😰",
            "😥",
            "😢",
            "😭",
            "😱",
            "😖",
            "😣",
            "😞",
            "😓",
            "😩",
            "😫",
            "🥱",
            "😤",
            "😡",
            "😠",
            "🤬",
            "😈",
            "👿",
            "💀",
            "☠️",
            "💩",
            "🤡",
            "👹",
            "👺",
            "👻",
            "👽",
            "👾",
            "🤖",
            "😺",
            "😸",
            "😹",
            "😻",
            "😼",
            "😽",
            "🙀",
            "😿",
            "😾",
            "🙈",
            "🙉",
            "🙊",
            "💋",
            "💌",
            "💘",
            "💝",
            "💖",
            "💗",
            "💓",
            "💞",
            "💕",
            "💟",
            "❣️",
            "💔",
            "❤️‍🔥",
            "❤️‍🩹",
            "❤️",
            "🧡",
            "💛",
            "💚",
            "💙",
            "💜",
            "🤎",
            "🖤",
            "🤍",
            "💯",
            "💢",
            "💥",
            "💫",
            "💦",
            "💨",
            "🕳️",
            "💣",
            "💬",
            "👁️‍🗨️",
            "🗨️",
            "🗯️",
            "💭",
            "💤"
    )
    val animalsEmojis = listOf(
            "🐵",
            "🐒",
            "🦍",
            "🦧",
            "🐶",
            "🐕",
            "🦮",
            "🐕‍🦺",
            "🐩",
            "🐺",
            "🦊",
            "🦝",
            "🐱",
            "🐈",
            "🐈‍⬛",
            "🦁",
            "🐯",
            "🐅",
            "🐆",
            "🐴",
            "🐎",
            "🦄",
            "🦓",
            "🦌",
            "🦬",
            "🐮",
            "🐂",
            "🐃",
            "🐄",
            "🐷",
            "🐖",
            "🐗",
            "🐽",
            "🐏",
            "🐑",
            "🐐",
            "🐪",
            "🐫",
            "🦙",
            "🦒",
            "🐘",
            "🦣",
            "🦏",
            "🦛",
            "🐭",
            "🐁",
            "🐀",
            "🐹",
            "🐰",
            "🐇",
            "🐿️",
            "🦫",
            "🦔",
            "🦇",
            "🐻",
            "🐻‍❄️",
            "🐨",
            "🐼",
            "🦥",
            "🦦",
            "🦨",
            "🦘",
            "🦡",
            "🐾",
            "🦃",
            "🐔",
            "🐓",
            "🐣",
            "🐤",
            "🐥",
            "🐦",
            "🐧",
            "🕊️",
            "🦅",
            "🦆",
            "🦢",
            "🦉",
            "🦤",
            "🪶",
            "🦩",
            "🦚",
            "🦜",
            "🐸",
            "🐊",
            "🐢",
            "🦎",
            "🐍",
            "🐲",
            "🐉",
            "🦕",
            "🦖",
            "🐳",
            "🐋",
            "🐬",
            "🦭",
            "🐟",
            "🐠",
            "🐡",
            "🦈",
            "🐙",
            "🐚",
            "🪸",
            "🐌",
            "🦋",
            "🐛",
            "🐜",
            "🐝",
            "🪲",
            "🐞",
            "🦗",
            "🪳",
            "🕷️",
            "🕸️",
            "🦂",
            "🦟",
            "🪰",
            "🪱",
            "🦠",
            "💐",
            "🌸",
            "💮",
            "🪷",
            "🏵️",
            "🌹",
            "🥀",
            "🌺",
            "🌻",
            "🌼",
            "🌷",
            "🌱",
            "🪴",
            "🌲",
            "🌳",
            "🌴",
            "🌵",
            "🌾",
            "🌿",
            "☘️",
            "🍀",
            "🍁",
            "🍂",
            "🍃"
    )
    val peopleEmojis = listOf(
            "👋",
            "🤚",
            "🖐️",
            "✋",
            "🖖",
            "👌",
            "🤌",
            "🤏",
            "✌️",
            "🤞",
            "🤟",
            "🤘",
            "🤙",
            "👈",
            "👉",
            "👆",
            "🖕",
            "👇",
            "☝️",
            "👍",
            "👎",
            "✊",
            "👊",
            "🤛",
            "🤜",
            "👏",
            "🙌",
            "👐",
            "🤲",
            "🤝",
            "🙏",
            "✍️",
            "💅",
            "🤳",
            "💪",
            "🦾",
            "🦿",
            "🦵",
            "🦶",
            "👂",
            "🦻",
            "👃",
            "🧠",
            "🫀",
            "🫁",
            "🦷",
            "🦴",
            "👀",
            "👁️",
            "👅",
            "👄",
            "🫦",
            "👶",
            "🧒",
            "👦",
            "👧",
            "🧑",
            "👱",
            "👨",
            "🧔",
            "🧔‍♂️",
            "🧔‍♀️",
            "👨‍🦰",
            "👨‍🦱",
            "👨‍🦳",
            "👨‍🦲",
            "👩",
            "👩‍🦰",
            "🧑‍🦰",
            "👩‍🦱",
            "🧑‍🦱",
            "👩‍🦳",
            "🧑‍🦳",
            "👩‍🦲",
            "🧑‍🦲",
            "👱‍♀️",
            "👱‍♂️",
            "🧓",
            "👴",
            "👵",
            "🙍",
            "🙍‍♂️",
            "🙍‍♀️",
            "🙎",
            "🙎‍♂️",
            "🙎‍♀️",
            "🙅",
            "🙅‍♂️",
            "🙅‍♀️",
            "🙆",
            "🙆‍♂️",
            "🙆‍♀️",
            "💁",
            "💁‍♂️",
            "💁‍♀️",
            "🙋",
            "🙋‍♂️",
            "🙋‍♀️",
            "🧏",
            "🧏‍♂️",
            "🧏‍♀️",
            "🙇",
            "🙇‍♂️",
            "🙇‍♀️",
            "🤦",
            "🤦‍♂️",
            "🤦‍♀️",
            "🤷",
            "🤷‍♂️",
            "🤷‍♀️",
            "🧑‍⚕️",
            "👨‍⚕️",
            "👩‍⚕️",
            "🧑‍🎓",
            "👨‍🎓",
            "👩‍🎓",
            "🧑‍🏫",
            "👨‍🏫",
            "👩‍🏫",
            "🧑‍⚖️",
            "👨‍⚖️",
            "👩‍⚖️",
            "🧑‍🌾",
            "👨‍🌾",
            "👩‍🌾",
            "🧑‍🍳",
            "👨‍🍳",
            "👩‍🍳",
            "🧑‍🔧",
            "👨‍🔧",
            "👩‍🔧",
            "🧑‍🏭",
            "👨‍🏭",
            "👩‍🏭",
            "🧑‍💼",
            "👨‍💼",
            "👩‍💼",
            "🧑‍🔬",
            "👨‍🔬",
            "👩‍🔬",
            "🧑‍💻",
            "👨",
            "👩‍💻",
            "🧑‍🎤",
            "👨‍🎤",
            "👩‍🎤",
            "🧑‍🎨",
            "👨‍🎨",
            "👩‍🎨",
            "🧑‍✈️",
            "👨‍✈️",
            "👩‍✈️",
            "🧑‍🚀",
            "👨‍🚀",
            "👩‍🚀",
            "🧑‍🚒",
            "👨‍🚒",
            "👩‍🚒",
            "👮",
            "👮‍♂️",
            "👮‍♀️",
            "🕵️",
            "🕵️‍♂️",
            "🕵️‍♀️",
            "💂",
            "💂‍♂️",
            "💂‍♀️",
            "🥷",
            "👷",
            "👷‍♂️",
            "👷‍♀️",
            "🫅",
            "🤴",
            "👸",
            "👳",
            "👳‍♂️",
            "👳‍♀️",
            "👲",
            "🧕",
            "🤵",
            "🤵‍♂️",
            "🤵‍♀️",
            "👰",
            "👰‍♂️",
            "👰‍♀️",
            "🤰",
            "🫃",
            "🫄",
            "🤱",
            "👩‍🍼",
            "👨‍🍼",
            "🧑‍🍼",
            "👼",
            "🎅",
            "🤶",
            "🧑‍🎄",
            "🦸",
            "🦸‍♂️",
            "🦸‍♀️",
            "🦹",
            "🦹‍♂️",
            "🦹‍♀️",
            "🧙",
            "🧙‍♂️",
            "🧙‍♀️",
            "🧚",
            "🧚‍♂️",
            "🧚‍♀️",
            "🧛",
            "🧛‍♂️",
            "🧛‍♀️",
            "🧜",
            "🧜‍♂️",
            "🧜‍♀️",
            "🧝",
            "🧝‍♂️",
            "🧝‍♀️",
            "🧞",
            "🧞‍♂️",
            "🧞‍♀️",
            "🧟",
            "🧟‍♂️",
            "🧟‍♀️",
            "🧌",
            "💆",
            "💆‍♂️",
            "💆‍♀️",
            "💇",
            "💇‍♂️",
            "💇‍♀️",
            "🚶",
            "🚶‍♂️",
            "🚶‍♀️",
            "🧍",
            "🧍‍♂️",
            "🧍‍♀️",
            "🧎",
            "🧎‍♂️",
            "🧎‍♀️",
            "🧑‍🦯",
            "👨‍🦯",
            "👩‍🦯",
            "🧑‍🦼",
            "👨‍🦼",
            "👩‍🦼",
            "🧑‍🦽",
            "👨‍🦽",
            "👩‍🦽",
            "🏃",
            "🏃‍♂️",
            "🏃‍♀️",
            "💃",
            "🕺",
            "🕴️",
            "👯",
            "👯‍♂️",
            "👯‍♀️",
            "🧖",
            "🧖‍♂️",
            "🧖‍♀️",
            "🧗",
            "🧗‍♂️",
            "🧗‍♀️",
            "🤺",
            "🏇",
            "⛷️",
            "🏂",
            "🏌️",
            "🏌️‍♂️",
            "🏌️‍♀️",
            "🏄",
            "🏄‍♂️",
            "🏄‍♀️",
            "🚣",
            "🚣‍♂️",
            "🚣‍♀️",
            "🏊",
            "🏊‍♂️",
            "🏊‍♀️",
            "⛹️",
            "⛹️‍♂️",
            "⛹️‍♀️",
            "🏋️",
            "🏋️‍♂️",
            "🏋️‍♀️",
            "🚴",
            "🚴‍♂️",
            "🚴‍♀️",
            "🚵",
            "🚵‍♂️",
            "🚵‍♀️",
            "🤸",
            "🤸‍♂️",
            "🤸‍♀️",
            "🤼",
            "🤼‍♂️",
            "🤼‍♀️",
            "🤽",
            "🤽‍♂️",
            "🤽‍♀️",
            "🤾",
            "🤾‍♂️",
            "🤾‍♀️",
            "🤹",
            "🤹‍♂️",
            "🤹‍♀️",
            "🧘",
            "🧘‍♂️",
            "🧘‍♀️",
            "🛀",
            "🛌",
            "🧑‍🤝‍🧑",
            "👭",
            "👫",
            "👬",
            "💏",
            "👩‍❤️‍💋‍👨",
            "👨‍❤️‍💋‍👨",
            "👩‍❤️‍💋‍👩",
            "💑",
            "👩‍❤️‍👨",
            "👨‍❤️‍👨",
            "👩‍❤️‍👩",
            "👪",
            "👨‍👩‍👦",
            "👨‍👩‍👧",
            "👨‍👩‍👧‍👦",
            "👨‍👩‍👦‍👦",
            "👨‍👩‍👧‍👧",
            "👨‍👨‍👦",
            "👨‍👨‍👧",
            "👨‍👨‍👧‍👦",
            "👨‍👨‍👦‍👦",
            "👨‍👨‍👧‍👧",
            "👩‍👩‍👦",
            "👩‍👩‍👧",
            "👩‍👩‍👧‍👦",
            "👩‍👩‍👦‍👦",
            "👩‍👩‍👧‍👧",
            "👨‍👦",
            "👨‍👦‍👦",
            "👨‍👧",
            "👨‍👧‍👦",
            "👨‍👧‍👧",
            "👩‍👦",
            "👩‍👦‍👦",
            "👩‍👧",
            "👩‍👧‍👦",
            "👩‍👧‍👧",
            "🗣️",
            "👤",
            "👥",
            "🫂",
            "👣"
    )
    val foodEmojis = listOf(
            "🍇",
            "🍈",
            "🍉",
            "🍊",
            "🍋",
            "🍌",
            "🍍",
            "🥭",
            "🍎",
            "🍏",
            "🍐",
            "🍑",
            "🍒",
            "🍓",
            "🫐",
            "🥝",
            "🍅",
            "🫒",
            "🥥",
            "🥑",
            "🍆",
            "🥔",
            "🥕",
            "🌽",
            "🌶️",
            "🫑",
            "🥒",
            "🥬",
            "🥦",
            "🧄",
            "🧅",
            "🍄",
            "🥜",
            "🫘",
            "🌰",
            "🍞",
            "🥐",
            "🥖",
            "🫓",
            "🥨",
            "🥯",
            "🥞",
            "🧇",
            "🧀",
            "🍖",
            "🍗",
            "🥩",
            "🥓",
            "🍔",
            "🍟",
            "🍕",
            "🌭",
            "🥪",
            "🌮",
            "🌯",
            "🫔",
            "🥙",
            "🧆",
            "🥚",
            "🍳",
            "🥘",
            "🍲",
            "🫕",
            "🥣",
            "🥗",
            "🍿",
            "🧈",
            "🧂",
            "🥫",
            "🍱",
            "🍘",
            "🍙",
            "🍚",
            "🍛",
            "🍜",
            "🍝",
            "🍠",
            "🍢",
            "🍣",
            "🍤",
            "🍥",
            "🥮",
            "🍡",
            "🥟",
            "🥠",
            "🥡",
            "🦀",
            "🦞",
            "🦐",
            "🦑",
            "🦪",
            "🍦",
            "🍧",
            "🍨",
            "🍩",
            "🍪",
            "🎂",
            "🍰",
            "🧁",
            "🥧",
            "🍫",
            "🍬",
            "🍭",
            "🍮",
            "🍯",
            "🍼",
            "🥛",
            "☕",
            "🫖",
            "🍵",
            "🍶",
            "🍾",
            "🍷",
            "🍸",
            "🍹",
            "🍺",
            "🍻",
            "🥂",
            "🥃",
            "🫗",
            "🥤",
            "🧋",
            "🧃",
            "🧉",
            "🧊",
            "🥢",
            "🍽️",
            "🍴",
            "🥄",
            "🔪",
            "🫙",
            "🏺"
    )
    val cityEmojis = listOf(
            "🌍",
            "🌎",
            "🌏",
            "🌐",
            "🗺️",
            "🗾",
            "🧭",
            "🏔️",
            "⛰️",
            "🌋",
            "🗻",
            "🏕️",
            "🏖️",
            "🏜️",
            "🏝️",
            "🏞️",
            "🏟️",
            "🏛️",
            "🏗️",
            "🧱",
            "🪨",
            "🪵",
            "🛖",
            "🏘️",
            "🏚️",
            "🏠",
            "🏡",
            "🏢",
            "🏣",
            "🏤",
            "🏥",
            "🏦",
            "🏨",
            "🏩",
            "🏪",
            "🏫",
            "🏬",
            "🏭",
            "🏯",
            "🏰",
            "💒",
            "🗼",
            "🗽",
            "⛪",
            "🕌",
            "🛕",
            "🕍",
            "⛩️",
            "🕋",
            "⛲",
            "⛺",
            "🌁",
            "🌃",
            "🏙️",
            "🌄",
            "🌅",
            "🌆",
            "🌇",
            "🌉",
            "♨️",
            "🎠",
            "🛝",
            "🎡",
            "🎢",
            "💈",
            "🎪",
            "🚂",
            "🚃",
            "🚄",
            "🚅",
            "🚆",
            "🚇",
            "🚈",
            "🚉",
            "🚊",
            "🚝",
            "🚞",
            "🚋",
            "🚌",
            "🚍",
            "🚎",
            "🚐",
            "🚑",
            "🚒",
            "🚓",
            "🚔",
            "🚕",
            "🚖",
            "🚗",
            "🚘",
            "🚙",
            "🛻",
            "🚚",
            "🚛",
            "🚜",
            "🏎️",
            "🏍️",
            "🛵",
            "🦽",
            "🦼",
            "🛺",
            "🚲",
            "🛴",
            "🛹",
            "🛼",
            "🚏",
            "🛣️",
            "🛤️",
            "🛢️",
            "⛽",
            "🛞",
            "🚨",
            "🚥",
            "🚦",
            "🛑",
            "🚧",
            "⚓",
            "🛟",
            "⛵",
            "🛶",
            "🚤",
            "🛳️",
            "⛴️",
            "🛥️",
            "🚢",
            "✈️",
            "🛩️",
            "🛫",
            "🛬",
            "🪂",
            "💺",
            "🚁",
            "🚟",
            "🚠",
            "🚡",
            "🛰️",
            "🚀",
            "🛸",
            "🛎️",
            "🧳",
            "⌛",
            "⏳",
            "⌚",
            "⏰",
            "⏱️",
            "⏲️",
            "🕰️",
            "🕛",
            "🕧",
            "🕐",
            "🕜",
            "🕑",
            "🕝",
            "🕒",
            "🕞",
            "🕓",
            "🕟",
            "🕔",
            "🕠",
            "🕕",
            "🕡",
            "🕖",
            "🕢",
            "🕗",
            "🕣",
            "🕘",
            "🕤",
            "🕙",
            "🕥",
            "🕚",
            "🕦",
            "🌑",
            "🌒",
            "🌓",
            "🌔",
            "🌕",
            "🌖",
            "🌗",
            "🌘",
            "🌙",
            "🌚",
            "🌛",
            "🌜",
            "🌡️",
            "☀️",
            "🌝",
            "🌞",
            "🪐",
            "⭐",
            "🌟",
            "🌠",
            "🌌",
            "☁️",
            "⛅",
            "⛈️",
            "🌤️",
            "🌥️",
            "🌦️",
            "🌧️",
            "🌨️",
            "🌩️",
            "🌪️",
            "🌫️",
            "🌬️",
            "🌀",
            "🌈",
            "🌂",
            "☂️",
            "☔",
            "⛱️",
            "⚡",
            "❄️",
            "☃️",
            "⛄",
            "☄️",
            "🔥",
            "💧",
            "🌊"
    )
    val flagEmojis = listOf(
            "🏁",
            "🚩",
            "🎌",
            "🏴",
            "🏳️",
            "🏳️‍🌈",
            "🏳️‍⚧️",
            "🏴‍☠️",
            "🇦🇨",
            "🇦🇩",
            "🇦🇪",
            "🇦🇫",
            "🇦🇬",
            "🇦🇮",
            "🇦🇱",
            "🇦🇲",
            "🇦🇴",
            "🇦🇶",
            "🇦🇷",
            "🇦🇸",
            "🇦🇹",
            "🇦🇺",
            "🇦🇼",
            "🇦🇽",
            "🇦🇿",
            "🇧🇦",
            "🇧🇧",
            "🇧🇩",
            "🇧🇪",
            "🇧🇫",
            "🇧🇬",
            "🇧🇭",
            "🇧🇮",
            "🇧🇯",
            "🇧🇱",
            "🇧🇲",
            "🇧🇳",
            "🇧🇴",
            "🇧🇶",
            "🇧🇷",
            "🇧🇸",
            "🇧🇹",
            "🇧🇻",
            "🇧🇼",
            "🇧🇾",
            "🇧🇿",
            "🇨🇦",
            "🇨🇨",
            "🇨🇩",
            "🇨🇫",
            "🇨🇬",
            "🇨🇭",
            "🇨🇮",
            "🇨🇰",
            "🇨🇱",
            "🇨🇲",
            "🇨🇳",
            "🇨🇴",
            "🇨🇵",
            "🇨🇷",
            "🇨🇺",
            "🇨🇻",
            "🇨🇼",
            "🇨🇽",
            "🇨🇾",
            "🇨🇿",
            "🇩🇪",
            "🇩🇬",
            "🇩🇯",
            "🇩🇰",
            "🇩🇲",
            "🇩🇴",
            "🇩🇿",
            "🇪🇦",
            "🇪🇨",
            "🇪🇪",
            "🇪🇬",
            "🇪🇭",
            "🇪🇷",
            "🇪🇸",
            "🇪🇹",
            "🇪🇺",
            "🇫🇮",
            "🇫🇯",
            "🇫🇰",
            "🇫🇲",
            "🇫🇴",
            "🇫🇷",
            "🇬🇦",
            "🇬🇧",
            "🇬🇩",
            "🇬🇪",
            "🇬🇫",
            "🇬🇬",
            "🇬🇭",
            "🇬🇮",
            "🇬🇱",
            "🇬🇲",
            "🇬🇳",
            "🇬🇵",
            "🇬🇶",
            "🇬🇷",
            "🇬🇸",
            "🇬🇹",
            "🇬🇺",
            "🇬🇼",
            "🇬🇾",
            "🇭🇰",
            "🇭🇲",
            "🇭🇳",
            "🇭🇷",
            "🇭🇹",
            "🇭🇺",
            "🇮🇨",
            "🇮🇩",
            "🇮🇪",
            "🇮🇱",
            "🇮🇲",
            "🇮🇳",
            "🇮🇴",
            "🇮🇶",
            "🇮🇷",
            "🇮🇸",
            "🇮🇹",
            "🇯🇪",
            "🇯🇲",
            "🇯🇴",
            "🇯🇵",
            "🇰🇪",
            "🇰🇬",
            "🇰🇭",
            "🇰🇮",
            "🇰🇲",
            "🇰🇳",
            "🇰🇵",
            "🇰🇷",
            "🇰🇼",
            "🇰🇾",
            "🇰🇿",
            "🇱🇦",
            "🇱🇧",
            "🇱🇨",
            "🇱🇮",
            "🇱🇰",
            "🇱🇷",
            "🇱🇸",
            "🇱🇹",
            "🇱🇺",
            "🇱🇻",
            "🇱🇾",
            "🇲🇦",
            "🇲🇨",
            "🇲🇩",
            "🇲🇪",
            "🇲🇫",
            "🇲🇬",
            "🇲🇭",
            "🇲🇰",
            "🇲🇱",
            "🇲🇲",
            "🇲🇳",
            "🇲🇴",
            "🇲🇵",
            "🇲🇶",
            "🇲🇷",
            "🇲🇸",
            "🇲🇹",
            "🇲🇺",
            "🇲🇻",
            "🇲🇼",
            "🇲🇽",
            "🇲🇾",
            "🇲🇿",
            "🇳🇦",
            "🇳🇨",
            "🇳🇪",
            "🇳🇫",
            "🇳🇬",
            "🇳🇮",
            "🇳🇱",
            "🇳🇴",
            "🇳🇵",
            "🇳🇷",
            "🇳🇺",
            "🇳🇿",
            "🇴🇲",
            "🇵🇦",
            "🇵🇪",
            "🇵🇫",
            "🇵"
    )
    val bulbEmojis = listOf(
            "👓",
            "🕶️",
            "🥽",
            "🥼",
            "🦺",
            "👔",
            "👕",
            "👖",
            "🧣",
            "🧤",
            "🧥",
            "🧦",
            "👗",
            "👘",
            "🥻",
            "🩱",
            "🩲",
            "🩳",
            "👙",
            "👚",
            "👛",
            "👜",
            "👝",
            "🛍️",
            "🎒",
            "🩴",
            "👞",
            "👟",
            "🥾",
            "🥿",
            "👠",
            "👡",
            "🩰",
            "👢",
            "👑",
            "👒",
            "🎩",
            "🎓",
            "🧢",
            "🪖",
            "⛑️",
            "📿",
            "💄",
            "💍",
            "💎",
            "🔇",
            "🔈",
            "🔉",
            "🔊",
            "📢",
            "📣",
            "📯",
            "🔔",
            "🔕",
            "🎼",
            "🎵",
            "🎶",
            "🎙️",
            "🎚️",
            "🎛️",
            "🎤",
            "🎧",
            "📻",
            "🎷",
            "🪗",
            "🎸",
            "🎹",
            "🎺",
            "🎻",
            "🪕",
            "🥁",
            "🪘",
            "📱",
            "📲",
            "☎️",
            "📞",
            "📟",
            "📠",
            "🔋",
            "🪫",
            "🔌",
            "💻",
            "🖥️",
            "🖨️",
            "⌨️",
            "🖱️",
            "🖲️",
            "💽",
            "💾",
            "💿",
            "📀",
            "🧮",
            "🎥",
            "🎞️",
            "📽️",
            "🎬",
            "📺",
            "📷",
            "📸",
            "📹",
            "📼",
            "🔍",
            "🔎",
            "🕯️",
            "💡",
            "🔦",
            "🏮",
            "🪔",
            "📔",
            "📕",
            "📖",
            "📗",
            "📘",
            "📙",
            "📚",
            "📓",
            "📒",
            "📃",
            "📜",
            "📄",
            "📰",
            "🗞️",
            "📑",
            "🔖",
            "🏷️",
            "💰",
            "🪙",
            "💴",
            "💵",
            "💶",
            "💷",
            "💸",
            "💳",
            "🧾",
            "💹",
            "✉️",
            "📧",
            "📨",
            "📩",
            "📤",
            "📥",
            "📦",
            "📫",
            "📪",
            "📬",
            "📭",
            "📮",
            "🗳️",
            "✏️",
            "✒️",
            "🖋️",
            "🖊️",
            "🖌️",
            "🖍️",
            "📝",
            "💼",
            "📁",
            "📂",
            "🗂️",
            "📅",
            "📆",
            "🗒️",
            "🗓️",
            "📇",
            "📈",
            "📉",
            "📊",
            "📋",
            "📌",
            "📍",
            "📎",
            "🖇️",
            "📏",
            "📐",
            "✂️",
            "🗃️",
            "🗄️",
            "🗑️",
            "🔒",
            "🔓",
            "🔏",
            "🔐",
            "🔑",
            "🗝️",
            "🔨",
            "🪓",
            "⛏️",
            "⚒️",
            "🛠️",
            "🗡️",
            "⚔️",
            "🔫",
            "🪃",
            "🏹",
            "🛡️",
            "🪚",
            "🔧",
            "🪛",
            "🔩",
            "⚙️",
            "🗜️",
            "⚖️",
            "🦯",
            "🔗",
            "⛓️",
            "🪝",
            "🧰",
            "🧲",
            "🪜",
            "⚗️",
            "🧪",
            "🧫",
            "🧬",
            "🔬",
            "🔭",
            "📡",
            "💉",
            "🩸",
            "💊",
            "🩹",
            "🩼",
            "🩺",
            "🩻",
            "🚪",
            "🛗",
            "🪞",
            "🪟",
            "🛏️",
            "🛋️",
            "🪑",
            "🚽",
            "🪠",
            "🚿",
            "🛁",
            "🪤",
            "🪒",
            "🧴",
            "🧷",
            "🧹",
            "🧺",
            "🧻",
            "🪣",
            "🧼",
            "🫧",
            "🪥",
            "🧽",
            "🧯",
            "🛒",
            "🚬",
            "⚰️",
            "🪦",
            "⚱️",
            "🗿",
            "🪧",
            "🪪"
    )
    val winnerEmojis = listOf(
            "🎃",
            "🎄",
            "🎆",
            "🎇",
            "🧨",
            "✨",
            "🎈",
            "🎉",
            "🎊",
            "🎋",
            "🎍",
            "🎎",
            "🎏",
            "🎐",
            "🎑",
            "🧧",
            "🎀",
            "🎁",
            "🎗️",
            "🎟️",
            "🎫",
            "🎖️",
            "🏆",
            "🏅",
            "🥇",
            "🥈",
            "🥉",
            "⚽",
            "⚾",
            "🥎",
            "🏀",
            "🏐",
            "🏈",
            "🏉",
            "🎾",
            "🥏",
            "🎳",
            "🏏",
            "🏑",
            "🏒",
            "🥍",
            "🏓",
            "🏸",
            "🥊",
            "🥋",
            "🥅",
            "⛳",
            "⛸️",
            "🎣",
            "🤿",
            "🎽",
            "🎿",
            "🛷",
            "🥌",
            "🎯",
            "🪀",
            "🪁",
            "🎱",
            "🔮",
            "🪄",
            "🧿",
            "🪬",
            "🎮",
            "🕹️",
            "🎰",
            "🎲",
            "🧩",
            "🧸",
            "🪅",
            "🪩",
            "🪆",
            "♠️",
            "♥️",
            "♦️",
            "♣️",
            "♟️",
            "🃏",
            "🀄",
            "🎴",
            "🎭",
            "🖼️",
            "🎨",
            "🧵",
            "🪡",
            "🧶",
            "🪢"
    )
    val symbolsEmojis = listOf(
            "🏧",
            "🚮",
            "🚰",
            "♿",
            "🚹",
            "🚺",
            "🚻",
            "🚼",
            "🚾",
            "🛂",
            "🛃",
            "🛄",
            "🛅",
            "⚠️",
            "🚸",
            "⛔",
            "🚫",
            "🚳",
            "🚭",
            "🚯",
            "🚱",
            "🚷",
            "📵",
            "🔞",
            "☢️",
            "☣️",
            "⬆️",
            "↗️",
            "➡️",
            "↘️",
            "⬇️",
            "↙️",
            "⬅️",
            "↖️",
            "↕️",
            "↔️",
            "↩️",
            "↪️",
            "⤴️",
            "⤵️",
            "🔃",
            "🔄",
            "🔙",
            "🔚",
            "🔛",
            "🔜",
            "🔝",
            "🛐",
            "⚛️",
            "🕉️",
            "✡️",
            "☸️",
            "☯️",
            "✝️",
            "☦️",
            "☪️",
            "☮️",
            "🕎",
            "🔯",
            "♈",
            "♉",
            "♊",
            "♋",
            "♌",
            "♍",
            "♎",
            "♏",
            "♐",
            "♑",
            "♒",
            "♓",
            "⛎",
            "🔀",
            "🔁",
            "🔂",
            "▶️",
            "⏩",
            "⏭️",
            "⏯️",
            "◀️",
            "⏪",
            "⏮️",
            "🔼",
            "⏫",
            "🔽",
            "⏬",
            "⏸️",
            "⏹️",
            "⏺️",
            "⏏️",
            "🎦",
            "🔅",
            "🔆",
            "📶",
            "📳",
            "📴",
            "♀️",
            "♂️",
            "⚧️",
            "✖️",
            "➕",
            "➖",
            "➗",
            "🟰",
            "♾️",
            "‼️",
            "⁉️",
            "❓",
            "❔",
            "❕",
            "❗",
            "〰️",
            "💱",
            "💲",
            "⚕️",
            "♻️",
            "⚜️",
            "🔱",
            "📛",
            "🔰",
            "⭕",
            "✅",
            "☑️",
            "✔️",
            "❌",
            "❎",
            "➰",
            "➿",
            "〽️",
            "✳️",
            "✴️",
            "❇️",
            "©️",
            "®️",
            "™️",
            "#️⃣",
            "*️⃣",
            "0️⃣",
            "1️⃣",
            "2️⃣",
            "3️⃣",
            "4️⃣",
            "5️⃣",
            "6️⃣",
            "7️⃣",
            "8️⃣",
            "9️⃣",
            "🔟",
            "🔠",
            "🔡",
            "🔢",
            "🔣",
            "🔤",
            "🅰️",
            "🆎",
            "🅱️",
            "🆑",
            "🆒",
            "🆓",
            "ℹ️",
            "🆔",
            "Ⓜ️",
            "🆕",
            "🆖",
            "🅾️",
            "🆗",
            "🅿️",
            "🆘",
            "🆙",
            "🆚",
            "🈁",
            "🈂️",
            "🈷️",
            "🈶",
            "🈯",
            "🉐",
            "🈹",
            "🈚",
            "🈲",
            "🉑",
            "🈸",
            "🈴",
            "🈳",
            "㊗️",
            "㊙️",
            "🈺",
            "🈵",
            "🔴",
            "🟠",
            "🟡",
            "🟢",
            "🔵",
            "🟣",
            "🟤",
            "⚫",
            "⚪",
            "🟥",
            "🟧",
            "🟨",
            "🟩",
            "🟦",
            "🟪",
            "🟫",
            "⬛",
            "⬜",
            "◼️",
            "◻️",
            "◾",
            "◽",
            "▪️",
            "▫️",
            "🔶",
            "🔷",
            "🔸",
            "🔹",
            "🔺",
            "🔻",
            "💠",
            "🔘",
            "🔳",
            "🔲"
    )


    private val emojiCategories = listOf(
            EmojiCategory("Recent", recentEmojis),
            EmojiCategory("Smiley", smileEmojis),
            EmojiCategory("People", peopleEmojis),
            EmojiCategory("Animal", animalsEmojis),
            EmojiCategory("Food", foodEmojis),
            EmojiCategory("City", cityEmojis),
            EmojiCategory("Winner", winnerEmojis),
            EmojiCategory("Bulb", bulbEmojis),
            EmojiCategory("Symbols", symbolsEmojis),
            EmojiCategory("Flag", flagEmojis)
    )


    // For multi-tap
    private var mLastTapTime = 0L

    /** Whether the keyboard bitmap needs to be redrawn before it's blitted.  */
    private var mDrawPending = false

    /** The dirty region in the keyboard bitmap  */
    private val mDirtyRect = Rect()

    /** The keyboard bitmap for faster updates  */
    private var mBuffer: Bitmap? = null

    /** Notes if the keyboard just changed, so that we could possibly reallocate the mBuffer.  */
    private var mKeyboardChanged = false

    /** The canvas for the above mutable keyboard bitmap  */
    private var mCanvas: Canvas? = null

    /** The accessibility manager for accessibility support  */
    private val mAccessibilityManager: AccessibilityManager

    private var mHandler: Handler? = null

    companion object {
        private const val NOT_A_KEY = -1
        private val LONG_PRESSABLE_STATE_SET = intArrayOf(R.attr.state_long_pressable)
        private const val MSG_REMOVE_PREVIEW = 1
        private const val MSG_REPEAT = 2
        private const val MSG_LONGPRESS = 3
        private const val DELAY_AFTER_PREVIEW = 100
        private const val DEBOUNCE_TIME = 70
        private const val REPEAT_INTERVAL = 50 // ~20 keys per second
        private const val REPEAT_START_DELAY = 400
        private val LONGPRESS_TIMEOUT = ViewConfiguration.getLongPressTimeout()
    }

    init {
        val attributes =
                context.obtainStyledAttributes(attrs, R.styleable.MyKeyboardView, 0, defStyleRes)
        val inflater = context.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        val keyTextSize = 0
        val indexCnt = attributes.indexCount
        sharedPreferences = context.getSharedPreferences("MyPrefs", Context.MODE_PRIVATE)
        speechRecognizer = SpeechRecognizer.createSpeechRecognizer(context)
        speechRecognizer?.setRecognitionListener(SpeechRecognitionListener())

        try {
            for (i in 0 until indexCnt) {
                val attr = attributes.getIndex(i)
                when (attr) {
                    R.styleable.MyKeyboardView_keyTextSize -> mKeyTextSize =
                            attributes.getDimensionPixelSize(attr, 18)
                }
            }
        } finally {
            attributes.recycle()
        }

        mPopupLayout = R.layout.keyboard_popup_keyboard
        mKeyBackground = resources.getDrawable(R.drawable.keyboard_key_selector, context.theme)
        mVerticalCorrection = resources.getDimension(R.dimen.vertical_correction).toInt()
        mLabelTextSize = resources.getDimension(R.dimen.label_text_size).toInt()
        mPreviewHeight = resources.getDimension(R.dimen.key_height).toInt()
        mPreviewHeight = resources.getDimension(R.dimen.key_height).toInt()
        mSpaceMoveThreshold = resources.getDimension(R.dimen.medium_margin).toInt()
        mTextColor = context.getProperTextColor()
        mIconColor = context.getProperIconColor()
        mBackgroundColor = context.getProperBackgroundColor()
        mBackgroundBarColor = context.getProperKeyboardBackgroundColor()
        mPrimaryColor = context.getProperPrimaryColor()

        mPreviewPopup = PopupWindow(context)
        mPreviewText =
                inflater.inflate(resources.getLayout(R.layout.keyboard_key_preview), null) as TextView
        mPreviewTextSizeLarge = context.resources.getDimension(R.dimen.preview_text_size).toInt()
        mPreviewPopup.contentView = mPreviewText
        mPreviewPopup.setBackgroundDrawable(null)

        mPreviewPopup.isTouchable = false
        mPopupKeyboard = PopupWindow(context)
        mPopupKeyboard.setBackgroundDrawable(null)
        mPopupParent = this
        mPaint = Paint()
        mPaint.isAntiAlias = true
        mPaint.textSize = keyTextSize.toFloat()
        mPaint.textAlign = Align.CENTER
        mPaint.alpha = 255
        mMiniKeyboardCache = HashMap()
        mAccessibilityManager =
                (context.getSystemService(Context.ACCESSIBILITY_SERVICE) as AccessibilityManager)
        mPopupMaxMoveDistance = resources.getDimension(R.dimen.popup_max_move_distance)
        mTopSmallNumberSize = resources.getDimension(R.dimen.small_text_size)
        mTopSmallNumberMarginWidth = resources.getDimension(R.dimen.top_small_number_margin_width)
        mTopSmallNumberMarginHeight = resources.getDimension(R.dimen.top_small_number_margin_height)
    }


    private fun setupRecyclerView() {
        val emojiItemWidth = context.resources.getDimensionPixelSize(R.dimen.emoji_item_size)
        val emojiTopBarElevation =
                context.resources.getDimensionPixelSize(R.dimen.emoji_top_bar_elevation).toFloat()
        emojiAdapter = EmojiAdapter(emojiCategories[currentCategoryIndex].emojis) { emoji ->
            mOnKeyboardActionListener!!.onText(emoji)
            vibrateIfNeeded()
            addRecentEmoji(emoji)
            Log.d("Added Emoji", "" + emoji)
            updateTopBarElevation()
        }
        mEmojiPaletteHolder?.findViewById<MyRecyclerView>(R.id.emojis_list)?.adapter = emojiAdapter
        mEmojiPaletteHolder?.findViewById<MyRecyclerView>(R.id.emojis_list)?.layoutManager =
                AutoGridLayoutManager(context, emojiItemWidth)
        mEmojiPaletteHolder?.findViewById<MyRecyclerView>(R.id.emojis_list)?.onScroll {
            updateTopBarElevation()
        }
    }

    private fun setupGestureDetection() {
        val gestureListener = EmojiGestureListener()
        val gestureDetector = GestureDetector(context, gestureListener)
        mEmojiPaletteHolder?.findViewById<MyRecyclerView>(R.id.emojis_list)?.setOnTouchListener { _, event ->
            gestureDetector.onTouchEvent(
                    event
            )
        }
    }


    private inner class EmojiGestureListener : GestureDetector.SimpleOnGestureListener() {
        private val SWIPE_THRESHOLD = 100
        private val SWIPE_VELOCITY_THRESHOLD = 100

        override fun onFling(
                e1: MotionEvent, e2: MotionEvent, velocityX: Float, velocityY: Float
        ): Boolean {
            val diffX = e2.x - e1.x
            val diffY = e2.y - e1.y

            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > SWIPE_THRESHOLD && Math.abs(
                            velocityX
                    ) > SWIPE_VELOCITY_THRESHOLD
            ) {
                if (diffX > 0) {
                    // Swipe right
                    if (currentCategoryIndex > 0) {
                        currentCategoryIndex--
                        updateCategory()
                    }
                } else {
                    // Swipe left
                    if (currentCategoryIndex < emojiCategories.size - 1) {
                        currentCategoryIndex++
                        updateCategory()
                    }
                }
                return true
            }
            return false
        }
    }
    private fun getSearchResults(searchTerm: String, limit: Int): JSONObject? {
        val retrofit = Retrofit.Builder()
                .baseUrl("https://g.tenor.com/v1/")
                .client(OkHttpClient())
                .addConverterFactory(GsonConverterFactory.create())
                .build()

        val service = retrofit.create(TenorService::class.java)
        val call = service.getSearchResults(searchTerm,
                "LIVDSRZULELA" , limit)

        try {
            val response = call.execute()
            if (response.isSuccessful) {
                Log.d("Touch",""+response.body()?.string())
                return JSONObject(response.body()?.string())
            }
        } catch (e: IOException) {
            Log.d("Touch","")
            e.printStackTrace()
        }
        return null
    }




    private fun searchStickers(query: String) {
        val apiService = GIFStickerApiClient.retrofit.create(GiphyApiService::class.java)
        val call = apiService.searchStickers(
                apiKey = "f3b8PiHqEC58PxYkUN0KluDjNK6pTufN",
                query = query,
                limit = 10,
                offset = 0,
                rating = "g",
                lang = "en"
        )

        call.enqueue(object : retrofit2.Callback<StickerResponse> {
            override fun onResponse(
                    call: retrofit2.Call<StickerResponse>, response: retrofit2.Response<StickerResponse>
            ) {
                if (response.isSuccessful) {
                    val stickerResponse = response.body()
                    Log.d("SickerResponse:", "" + stickerResponse)
                    if (stickerResponse != null) {
                        stickers = stickerResponse.data
                        setupStickerAdapter()
                    }
                } else {
                    Log.e("MainActivity", "Error: ${response.code()}")
                }
            }

            override fun onFailure(call: retrofit2.Call<StickerResponse>, t: Throwable) {
                Log.e("MainActivity", "Error: ${t.message}")
            }
        })
    }

    private fun searchGIFs(query: String) {
        val apiService = GIFStickerApiClient.retrofit.create(GiphyGIFApiService::class.java)
        val call = apiService.searchGIFs(
                apiKey = "f3b8PiHqEC58PxYkUN0KluDjNK6pTufN",
                query = query,
                limit = 10,
                offset = 0,
                rating = "g",
                lang = "en"
        )

        call.enqueue(object : retrofit2.Callback<StickerResponse> {
            override fun onResponse(
                    call: retrofit2.Call<StickerResponse>, response: retrofit2.Response<StickerResponse>
            ) {
                if (response.isSuccessful) {
                    val GIFResponse = response.body()
                    Log.d("GIFResponse:", "" + GIFResponse)
                    if (GIFResponse != null) {
                        gifs = GIFResponse.data
                        setupGIFAdapter()
                    }
                } else {
                    Log.e("MainActivity", "Error: ${response.code()}")
                }
            }

            override fun onFailure(call: retrofit2.Call<StickerResponse>, t: Throwable) {
                Log.e("MainActivity", "Error: ${t.message}")
            }
        })
    }

    fun setTextFromSpeech(text: String) {
        post { text }
        mOnKeyboardActionListener!!.onText(text)
        closeSuggestionBox()
        closeEmojiSuggestionBox()
        Log.d("Speech Text:", "" + text)


    }


    private inner class SpeechRecognitionListener : RecognitionListener {
        override fun onReadyForSpeech(params: Bundle?) {
            // Speech recognition is ready to start
            setTextFromSpeeech("Speak now...")
        }

        override fun onBeginningOfSpeech() {
            // Speech recognition has started
            setTextFromSpeeech("Listening...")
        }

        override fun onRmsChanged(rmsdB: Float) {
            // Called when the RMS value of the input audio changes
        }

        override fun onBufferReceived(buffer: ByteArray?) {
            // Called when partial recognition results are available
        }

        override fun onEndOfSpeech() {
            // Speech recognition has ended
            setTextFromSpeeech("Tap to Speak")
        }

        override fun onError(error: Int) {
            // Speech recognition error occurred
            setTextFromSpeeech("Tap to Speak")
        }

        override fun onResults(results: Bundle?) {
            // Final recognition results are available
            val speechResult =
                    results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)?.get(0)
            if (speechResult != null) {
                setTextFromSpeech(speechResult)
            } else {
                setTextFromSpeeech("Tap to Speak")
            }
        }


        override fun onPartialResults(partialResults: Bundle?) {
            // Partial recognition results are available
            val speechPartialResult =
                    partialResults?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)?.get(0)
            if (speechPartialResult != null) {
                setTextFromSpeech(speechPartialResult)
            }
        }

        override fun onEvent(eventType: Int, params: Bundle?) {
            // Reserved for future use
        }
    }

    @SuppressLint("HandlerLeak")
    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        if (mHandler == null) {
            mHandler = object : Handler() {
                override fun handleMessage(msg: Message) {
                    try {
                        when (msg.what) {
                            MSG_REMOVE_PREVIEW -> mPreviewText!!.visibility = INVISIBLE
                            MSG_REPEAT -> if (repeatKey(false)) {
                                val repeat = Message.obtain(this, MSG_REPEAT)
                                sendMessageDelayed(repeat, REPEAT_INTERVAL.toLong())
                            }

                            MSG_LONGPRESS -> openPopupIfRequired(msg.obj as MotionEvent)
                            else -> {
                                // Handle any other cases here
                            }
                        }
                    } catch (e: Exception) {
                        // Handle the exception here, you can log it or perform other error handling actions.
                        Log.d("Error on handling message", "" + e)
                    }
                }

            }
        }
    }

    override fun onVisibilityChanged(changedView: View, visibility: Int) {
        super.onVisibilityChanged(changedView, visibility)
        closeClipboardManager()
        closeEmojiPalette()

        if (visibility == VISIBLE) {
            setupKeyboard(changedView)
        }
    }


    /**
     * Attaches a keyboard to this view. The keyboard can be switched at any time and the view will re-layout itself to accommodate the keyboard.
     * @param keyboard the keyboard to display in this view
     */
    fun setKeyboard(keyboard: MyKeyboard?) {
        if (mKeyboard != null) {
            showPreview(NOT_A_KEY)
        }

        closeClipboardManager()
        removeMessages()
        mKeyboard = keyboard
        val keys = mKeyboard!!.mKeys
        mKeys = keys!!.toMutableList() as ArrayList<MyKeyboard.Key>
        requestLayout()
        mKeyboardChanged = true
        invalidateAllKeys()
        computeProximityThreshold(keyboard)
        mMiniKeyboardCache.clear()
        // Not really necessary to do every time, but will free up views
        // Switching to a different keyboard should abort any pending keys so that the key up
        // doesn't get delivered to the old or new keyboard
        mAbortKey = true // Until the next ACTION_DOWN
    }


    /** Sets the top row above the keyboard containing a couple buttons and the clipboard **/
    fun setKeyboardHolder(keyboardHolder: View) {
//        mToolbarHolder = keyboardHolder.toolbar_holder
        mToolHolder = keyboardHolder.findViewById<LinearLayoutCompat>(R.id.tool_holder)
        mSuggHolder = keyboardHolder.findViewById<LinearLayout>(R.id.sugg_holder)
        mSuggEmojiHolder = keyboardHolder.findViewById<LinearLayout>(R.id.sugg_emoji_holder)
        mSearchHolder = keyboardHolder.findViewById<LinearLayout>(R.id.search_holder)
        mMicHolder = keyboardHolder.findViewById<RelativeLayout>(R.id.microphone_holder)
        mClipboardManagerHolder = keyboardHolder.findViewById<RelativeLayout>(R.id.clipboard_manager_holder)
        mEmojiPaletteHolder = keyboardHolder.findViewById<RelativeLayout>(R.id.emoji_palette_holder)
        mStickerPaletteHolder = keyboardHolder.findViewById<RelativeLayout>(R.id.sticker_palette_holder)
        mGIFPaletteHolder = keyboardHolder.findViewById<RelativeLayout>(R.id.GIF_palette_holder)

        val clipboardManager =
                (context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager)
        clipboardManager.addPrimaryClipChangedListener {
            val clipboardContent = clipboardManager.primaryClip?.getItemAt(0)?.text?.trim()
            if (clipboardContent?.isNotEmpty() == true) {
//                handleClipboard()
                inputconnection?.let { handleSuggestions(Suggestions, it) }
                handleTool()
                handleMic(analyzed_text)
            }
            setupStoredClips()
        }

        mClipboardManagerHolder?.apply {
            findViewById<ImageView>(R.id.clipboard_manager_close).setOnClickListener {
                vibrateIfNeeded()
                closeClipboardManager()
            }
        }
    }

    fun setTextFromSpeeech(atext: String) {
        post { handleMic(atext) }
        closeSuggestionBox()
        closeEmojiSuggestionBox()
        Log.d("Speech Analyze Text:", "" + atext)
    }

    fun handleMic(btext: String) {
        if (mMicHolder != null && mPopupParent.id != R.id.mini_keyboard_view) {
            mMicHolder?.apply {
                runOnUiThread {
                    findViewById<TextView>(R.id.centerText).apply {
                        runOnUiThread {
                            text = btext
                            Log.d("Speech Analyze Text:", "" + btext)
                        }
                        removeUnderlines()
                    }
                    findViewById<ImageView>(R.id.leftIcon).setOnClickListener {
                        closeSuggestionBox()
                        closeEmojiSuggestionBox()
                        closeMic()
                        openTool()
                    }
                }
            }
        }
    }

    fun setEditorInfo(editorInfo: EditorInfo) {
        emojiCompatMetadataVersion =
                editorInfo.extras?.getInt(EmojiCompat.EDITOR_INFO_METAVERSION_KEY, 0) ?: 0
    }

//    private fun requestInputConnection() {
//        currentInputconnection?.let { inputConnectionListener?.onInputConnectionReceived(it) }
//    }

    fun setupKeyboard(changedView: View? = null) {
        mTextColor = context.getProperTextColor()
        mBackgroundColor = context.getProperBackgroundColor()
        mPrimaryColor = context.getProperPrimaryColor()

        mShowKeyBorders = context.config.showKeyBorders
        mUsingSystemTheme = context.config.isUsingSystemTheme
        mUsingDarkTheme = context.isUsingSystemDarkTheme()
        mUsingWhiteTheme = context.isWhiteTheme()

        val isMainKeyboard = changedView == null || changedView != findViewById<MyKeyboardView>(R.id.mini_keyboard_view)
        mKeyBackground = if (mShowKeyBorders && isMainKeyboard) {
            resources.getDrawable(R.drawable.keyboard_key_selector_outlined, context.theme)
        } else {
            resources.getDrawable(R.drawable.keyboard_key_selector, context.theme)
        }
        mKeyColor = context.getProperKeyBackgroundColor()
        mKeyColorPressed = mKeyColor.adjustAlpha(0.2f)

        val strokeColor = context.getStrokeColor()
        val toolbarColor = context.getProperToolBarBackgroundColor()
        val darkerColor = context.getProperKeyboardBackgroundColor()
        val miniKeyboardBackgroundColor = context.getProperMiniBackgroundColor()

        if (!isMainKeyboard) {
            val previewBackground = background as LayerDrawable
            previewBackground.findDrawableByLayerId(R.id.button_background_shape)
                    .applyColorFilter(miniKeyboardBackgroundColor)
            previewBackground.findDrawableByLayerId(R.id.button_background_stroke)
                    .applyColorFilter(strokeColor)
            background = previewBackground
        } else {
            background.applyColorFilter(darkerColor)
        }

        val rippleBg =
                resources.getDrawable(R.drawable.clipboard_background, context.theme) as RippleDrawable
        val layerDrawable =
                rippleBg.findDrawableByLayerId(R.id.clipboard_background_holder) as LayerDrawable
        layerDrawable.findDrawableByLayerId(R.id.clipboard_background_stroke)
                .applyColorFilter(strokeColor)
        layerDrawable.findDrawableByLayerId(R.id.clipboard_background_shape)
                .applyColorFilter(mBackgroundColor)
        val wasDarkened = mBackgroundColor != mBackgroundColor.darkenColor()

        mMicHolder?.apply {
            runOnUiThread {
                findViewById<ImageView>(R.id.top_tool_keyboard_divider)?.beGoneIf(wasDarkened)
                findViewById<ImageView>(R.id.top_tool_keyboard_divider)?.background = ColorDrawable(strokeColor)
                background = ColorDrawable(mBackgroundBarColor)
                findViewById<ImageView>(R.id.right_icon)?.setOnClickListener {
                    startSpeechToText()
                }
                findViewById<TextView>(R.id.centerText)?.text = analyzed_text
            }
        }
        mSuggHolder?.apply {
            runOnUiThread {
                findViewById<ImageView>(R.id.top_sugg_keyboard_divider).beGoneIf(wasDarkened)
                findViewById<ImageView>(R.id.top_sugg_keyboard_divider).background = ColorDrawable(strokeColor)
                background = ColorDrawable(mBackgroundBarColor)
                //back.applyColorFilter(mIconColor)
            }
        }
        mSuggEmojiHolder?.apply {
            runOnUiThread {
                findViewById<ImageView>(R.id.top_sugg_keyboard_divider_e).beGoneIf(wasDarkened)
                findViewById<ImageView>(R.id.top_sugg_keyboard_divider_e).background = ColorDrawable(strokeColor)
                background = ColorDrawable(mBackgroundBarColor)
                //back.applyColorFilter(mIconColor)
            }
        }
        mToolHolder?.apply {
            findViewById<ImageView>(R.id.top_tool_keyboard_divider).beGoneIf(wasDarkened)
            findViewById<ImageView>(R.id.top_tool_keyboard_divider).background = ColorDrawable(strokeColor)
            background = ColorDrawable(mBackgroundBarColor)
            //tool_back.applyColorFilter(mIconColor)
            findViewById<ImageView>(R.id.ic_compass).applyColorFilter(mIconColor)
            findViewById<ImageView>(R.id.ic_microphone).applyColorFilter(mIconColor)
            findViewById<ImageView>(R.id.ic_theme).applyColorFilter(mIconColor)
            findViewById<ImageView>(R.id.ic_multilanguage).applyColorFilter(mIconColor)
            findViewById<ImageView>(R.id.pinned_clipboard_items).applyColorFilter(mIconColor)
            findViewById<ImageView>(R.id.ic_wallet).applyColorFilter(mIconColor)

            findViewById<ImageView>(R.id.ic_theme).setOnTouchListener { v, event ->
                when (event.action) {
                    MotionEvent.ACTION_DOWN -> {
                        vibrateIfNeeded()
                        Handler().postDelayed({
                        val intent = Intent("android.settings.DARK_THEME_SETTINGS")
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                        context.launchActivityIntent(intent)
                        }, 100)
                        // Set a shadow when the ImageView is pressed
                        findViewById<ImageView>(R.id.ic_theme).setBackgroundColor(Color.LTGRAY)
                        true
                    }

                    MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                        // Reset the ImageView to its original state when the touch is released
                        findViewById<ImageView>(R.id.ic_theme).setBackgroundColor(Color.TRANSPARENT)
                        true
                    }

                    else -> false
                }
            }

            findViewById<ImageView>(R.id.ic_microphone).setOnTouchListener { v, event ->
                when (event.action) {
                    MotionEvent.ACTION_DOWN -> {
                        vibrateIfNeeded()
                        startSpeechToText()
                        mMicHolder?.findViewById<RelativeLayout>(R.id.microphone_holder)?.visibility = VISIBLE
                        closeTool()
                        closeSuggestionBox()
                        closeEmojiSuggestionBox()
                        closeClipboardManager()
                        // Set a shadow when the ImageView is pressed
                        findViewById<ImageView>(R.id.ic_microphone).setBackgroundColor(Color.LTGRAY)
                        true
                    }

                    MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                        // Reset the ImageView to its original state when the touch is released
                        findViewById<ImageView>(R.id.ic_microphone).setBackgroundColor(Color.TRANSPARENT)
                        true
                    }

                    else -> false
                }
            }
            findViewById<ImageView>(R.id.ic_multilanguage).setOnTouchListener { v, event ->
                when (event.action) {
                    MotionEvent.ACTION_DOWN -> {
                        vibrateIfNeeded()
                        ChangeLanguagePopup(this, onSelect = {
                            mOnKeyboardActionListener?.reloadKeyboard()
                        })
                        // Set a shadow when the ImageView is pressed
                        findViewById<ImageView>(R.id.ic_multilanguage).setBackgroundColor(Color.LTGRAY)
                        true
                    }

                    MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                        // Reset the ImageView to its original state when the touch is released
                        findViewById<ImageView>(R.id.ic_multilanguage).setBackgroundColor(Color.TRANSPARENT)
                        true
                    }

                    else -> false
                }
            }

            findViewById<ImageView>(R.id.pinned_clipboard_items).setOnTouchListener { v, event ->
                when (event.action) {
                    MotionEvent.ACTION_DOWN -> {
                        findViewById<ImageView>(R.id.pinned_clipboard_items).setBackgroundColor(Color.LTGRAY)
                        vibrateIfNeeded()
                        openClipboardManager()
                        // Set a shadow when the ImageView is pressed
                        true
                    }

                    MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                        // Reset the ImageView to its original state when the touch is released
                        findViewById<ImageView>(R.id.pinned_clipboard_items).setBackgroundColor(Color.TRANSPARENT)
                        true
                    }

                    else -> false
                }
            }

            findViewById<ImageView>(R.id.ic_wallet).setOnTouchListener { v, event ->
                when (event.action) {
                    MotionEvent.ACTION_DOWN -> {
                        vibrateIfNeeded()
                        val walletUrl = "unblok://WalletHomeBottomTab"
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(walletUrl))
                        intent.setPackage("com.unblok") // This sets the package name for the Telegram app.
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                        context.launchActivityIntent(intent)
                        Log.d("Start:", "");
                        vibrateIfNeeded()
                        // Set a shadow when the ImageView is pressed
                        findViewById<ImageView>(R.id.ic_wallet).setBackgroundColor(Color.LTGRAY)
                        true
                    }

                    MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                        // Reset the ImageView to its original state when the touch is released
                        findViewById<ImageView>(R.id.ic_wallet).setBackgroundColor(Color.TRANSPARENT)
                        true
                    }

                    else -> false
                }
            }


            findViewById<ImageView>(R.id.ic_compass).setOnTouchListener { v, event ->
                when (event.action) {
                    MotionEvent.ACTION_DOWN -> {
                        val dappUrl = "unblok://DappBottomTab"
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(dappUrl))
                        intent.setPackage("com.unblok") // This sets the package name for the Telegram app.
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                        context.launchActivityIntent(intent)
                        Log.d("Start:", "");
                        vibrateIfNeeded()
                        // Set a shadow when the ImageView is pressed
                        findViewById<ImageView>(R.id.ic_compass).setBackgroundColor(Color.LTGRAY)
                        true
                    }

                    MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                        // Reset the ImageView to its original state when the touch is released
                        findViewById<ImageView>(R.id.ic_compass).setBackgroundColor(Color.TRANSPARENT)
                        true
                    }

                    else -> false
                }
            }

//            ic_compass.setOnClickListener {
//                val telegramUrl = "unblok://DappBottomTab"
//                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(telegramUrl))
//                intent.setPackage("com.unblok") // This sets the package name for the Telegram app.
//                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
//                context.launchActivityIntent(intent)
//                vibrateIfNeeded()
//            }

            findViewById<ImageView>(R.id.ic_multilanguage).setOnClickListener {
//                ChangeLanguagePopup(this, onSelect = {
//                    mOnKeyboardActionListener?.reloadKeyboard()
//                })
            }
        }

        mSearchStickerHolder?.apply {
            background = ColorDrawable(context.getProperKeyBackgroundColor())
            findViewById<EditText>(R.id.searchStickerEditText).setOnClickListener {
                val click: Boolean = true
                val editor = sharedPreferences.edit()
                editor.putBoolean("Check OnClick", click)
                editor.apply()
            }
        }

        mSearchHolder?.apply {
            runOnUiThread() {
                background = ColorDrawable(context.getProperKeyBackgroundColor())
                findViewById<EditText>(R.id.searchStickerEditText).setOnClickListener {
                    Log.d("OnClick: search", "")
                    mOnKeyboardActionListener?.onSearchClicked(true)
                    mOnKeyboardActionListener?.ClearConnection()
                }
                findViewById<EditText>(R.id.searchStickerEditText).setOnTouchListener { view, motionEvent ->
                    if (motionEvent.action == MotionEvent.ACTION_DOWN) {
                        mOnKeyboardActionListener?.onSearchClicked(true)
                        Log.d("OnClick:", "")
                    }
                    false // return true if you want to consume the touch event
                }
                findViewById<EditText>(R.id.searchStickerEditText).onCreateInputConnection(EditorInfo())
                findViewById<EditText>(R.id.searchStickerEditText).requestFocus()
//                val inputConnection = searchStickerEditText.onCreateInputConnection(EditorInfo())
//                inputConnection?.commitText(
//                    "Your text here",
//                    1
//                ) // Replace with the text you want to set

                val editTextWord = sharedPreferences.getString("EDITTEXT", "")
                findViewById<EditText>(R.id.searchStickerEditText).setText(editTextWord)
                Log.d("EditText Word:", "" + editTextWord)
            }
        }



        mClipboardManagerHolder?.apply {
            findViewById<ImageView>(R.id.top_clipboard_divider).beGoneIf(wasDarkened)
            findViewById<ImageView>(R.id.top_clipboard_divider).background = ColorDrawable(strokeColor)
            findViewById<RelativeLayout>(R.id.clipboard_manager_holder).background = ColorDrawable(mBackgroundBarColor)
            findViewById<ImageView>(R.id.clipboard_manager_close).applyColorFilter(mTextColor)
            findViewById<TextView>(R.id.clipboard_manager_label).setTextColor(mTextColor)
            findViewById<TextView>(R.id.clipboard_content_placeholder_1).setTextColor(mTextColor)
            findViewById<TextView>(R.id.clipboard_content_placeholder_2).setTextColor(mTextColor)
        }

        setupEmojiPalette(
                toolbarColor = toolbarColor,
                backgroundColor = mBackgroundBarColor,
                textColor = mTextColor
        )
        setupStickerPalette(
                toolbarColor = toolbarColor,
                backgroundColor = mBackgroundBarColor,
                textColor = mTextColor
        )
        setupGIFPalette(
                toolbarColor = toolbarColor,
                backgroundColor = mBackgroundBarColor,
                textColor = mTextColor
        )
        setupStoredClips()

    }

    fun vibrateIfNeeded() {
        if (context.config.vibrateOnKeypress) {
            performHapticFeedback()
        }
    }


    private fun setShifted(shiftState: ShiftState) {
        if (mKeyboard?.setShifted(shiftState) == true) {
            invalidateAllKeys()
        }
    }

    /**
     * Returns the state of the shift key of the keyboard, if any.
     * @return true if the shift is in a pressed state, false otherwise
     */
    private fun isShifted(): Boolean {
        return (mKeyboard?.mShiftState ?: ShiftState.OFF) > ShiftState.OFF
    }

    private fun setPopupOffset(x: Int, y: Int) {
        mMiniKeyboardOffsetX = x
        mMiniKeyboardOffsetY = y
        if (mPreviewPopup.isShowing) {
            mPreviewPopup.dismiss()
        }
    }

    private fun adjustCase(label: CharSequence): CharSequence? {
        var newLabel: CharSequence? = label
        if (newLabel != null && newLabel.isNotEmpty() && mKeyboard?.mShiftState != ShiftState.OFF && newLabel.length < 3 && Character.isLowerCase(
                        newLabel[0]
                )
        ) {
            newLabel = newLabel.toString().uppercase(Locale.getDefault())
        }
        return newLabel
    }

    public override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        if (mKeyboard == null) {
            setMeasuredDimension(0, 0)
        } else {
            var width = mKeyboard!!.mMinWidth
            if (MeasureSpec.getSize(widthMeasureSpec) < width + 10) {
                width = MeasureSpec.getSize(widthMeasureSpec)
            }
            setMeasuredDimension(width, mKeyboard!!.mHeight)
        }
    }

    /**
     * Compute the average distance between adjacent keys (horizontally and vertically) and square it to get the proximity threshold. We use a square here and
     * in computing the touch distance from a key's center to avoid taking a square root.
     * @param keyboard
     */
    private fun computeProximityThreshold(keyboard: MyKeyboard?) {
        if (keyboard == null) {
            return
        }

        val keys = mKeys
        val length = keys.size
        var dimensionSum = 0
        for (i in 0 until length) {
            val key = keys[i]
            dimensionSum += Math.min(key.width, key.height) + key.gap
        }

        if (dimensionSum < 0 || length == 0) {
            return
        }

        mProximityThreshold = (dimensionSum * 1.4f / length).toInt()
        mProximityThreshold *= mProximityThreshold // Square it
    }

    public override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        if (mDrawPending || mBuffer == null || mKeyboardChanged) {
            onBufferDraw()
        }
        canvas.drawBitmap(mBuffer!!, 0f, 0f, null)
    }

    @SuppressLint("UseCompatLoadingForDrawables")
    private fun onBufferDraw() {
        if (mBuffer == null || mKeyboardChanged) {
            if (mBuffer == null || mKeyboardChanged && (mBuffer!!.width != width || mBuffer!!.height != height)) {
                // Make sure our bitmap is at least 1x1
                val width = Math.max(1, width)
                val height = Math.max(1, height)
                mBuffer = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
                mCanvas = Canvas(mBuffer!!)
            }
            invalidateAllKeys()
            mKeyboardChanged = false
        }

        if (mKeyboard == null) {
            return
        }

        mCanvas?.save()
        val canvas = mCanvas
        canvas!!.clipRect(mDirtyRect)
        val paint = mPaint
        val keys = mKeys
        paint.color = mTextColor
        val smallLetterPaint = Paint().apply {
            set(paint)
            color = paint.color.adjustAlpha(0.8f)
            textSize = mTopSmallNumberSize
            typeface = Typeface.DEFAULT
        }

        canvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR)
//        handleClipboard()
        handleTool()
        inputconnection?.let { handleSuggestions(Suggestions, it) }
        handleMic(analyzed_text)


        val keyCount = keys.size
        for (i in 0 until keyCount) {
            val key = keys[i]
            val code = key.code

            // TODO: Space key background on a KEYBOARD_PHONE should not be applied
            setupKeyBackground(key, code, canvas)

            // Switch the character to uppercase if shift is pressed
            val label = adjustCase(key.label)?.toString()
            if (label?.isNotEmpty() == true) {
                // For characters, use large font. For labels like "Done", use small font.
                if (label.length > 1) {
                    paint.textSize = mLabelTextSize.toFloat()
                    paint.typeface = Typeface.DEFAULT
                } else {
                    paint.textSize = mKeyTextSize.toFloat()
                    paint.typeface = Typeface.DEFAULT
                }

                paint.color = if (key.focused) {
                    mPrimaryColor.getContrastColor()
                } else if (key.code == KEYCODE_123 || key.code == KEYCODE_DOT || key.code == KEYCODE_COMMA || key.code == KEYCODE_DOT || key.code == -1) {
                    mIconColor
                } else {
                    mTextColor
                }

                canvas.drawText(
                        label,
                        (key.width / 2).toFloat(),
                        key.height / 2 + (paint.textSize - paint.descent()) / 2,
                        paint
                )

                if (key.topSmallNumber.isNotEmpty() && !context.config.showNumbersRow) {
                    canvas.drawText(
                            key.topSmallNumber,
                            key.width - mTopSmallNumberMarginWidth,
                            mTopSmallNumberMarginHeight,
                            smallLetterPaint
                    )
                }

                // Turn off drop shadow
                paint.setShadowLayer(0f, 0f, 0f, 0)
            } else if (key.icon != null && mKeyboard != null) {
                if (code == KEYCODE_SHIFT) {
                    val drawableId = when (mKeyboard?.mShiftState) {
                        ShiftState.OFF -> R.drawable.ic_caps_outline_vector
                        ShiftState.ON_ONE_CHAR -> R.drawable.ic_caps_vector
                        else -> R.drawable.ic_caps_underlined_vector
                    }
                    key.icon = resources.getDrawable(drawableId)
                }
                if (mUsingSystemTheme) {
                    if (code == KEYCODE_SPACE) {
                        val drawableId = when (mKeyboard?.mspaceClick) {
                            key.pressed -> R.drawable.ic_space_click
                            else -> R.drawable.ic_space_stroke_white
                        }
                        key.icon = resources.getDrawable(drawableId)
                    }
                }
                if (mUsingDarkTheme) {
                    if (code == KEYCODE_SPACE) {
                        val drawableId = when (mKeyboard?.mspaceClick) {
                            key.pressed -> R.drawable.ic_space_click
                            else -> R.drawable.space_no_stroke_white
                        }
                        key.icon = resources.getDrawable(drawableId)
                    }
                }
                if (mUsingSystemTheme) {
                    if (code == KEYCODE_SPACE_N) {
                        val drawableId = when (mKeyboard?.mspaceClick) {
                            key.pressed -> R.drawable.ic_space_new
                            else -> R.drawable.ic_space_new
                        }
                        key.icon = resources.getDrawable(drawableId)
                    }
                }
                if (mUsingDarkTheme) {
                    if (code == KEYCODE_SPACE_N) {
                        val drawableId = when (mKeyboard?.mspaceClick) {
                            key.pressed -> R.drawable.ic_space_new_dark
                            else -> R.drawable.ic_space_new_dark
                        }
                        key.icon = resources.getDrawable(drawableId)
                    }

                }


                if (code == KEYCODE_ENTER) {
                    key.icon?.applyColorFilter(mIconColor)
                } else if (code == KEYCODE_DELETE || code == KEYCODE_SHIFT || code == KEYCODE_EMOJI) {
                    key.icon?.applyColorFilter(mIconColor)
                }
                val keyIcon = key.icon!!
                val secondaryIcon = key.secondaryIcon

                if (secondaryIcon != null) {
                    val keyIconWidth = (keyIcon.intrinsicWidth * 0.9f).toInt()
                    val keyIconHeight = (keyIcon.intrinsicHeight * 0.9f).toInt()
                    val secondaryIconWidth = (secondaryIcon.intrinsicWidth * .6f).toInt()
                    val secondaryIconHeight = (secondaryIcon.intrinsicHeight * .6f).toInt()

                    val centerX = key.width / 2
                    val centerY = key.height / 2

                    val keyIconLeft = centerX - keyIconWidth / 2
                    val keyIconTop = centerY - keyIconHeight / 2

                    keyIcon.setBounds(
                            keyIconLeft,
                            keyIconTop,
                            keyIconLeft + keyIconWidth,
                            keyIconTop + keyIconHeight
                    )
                    keyIcon.draw(canvas)

                    val secondaryIconPaddingRight = 10
                    val secondaryIconLeft =
                            key.width - secondaryIconPaddingRight - secondaryIconWidth
                    val secondaryIconRight = secondaryIconLeft + secondaryIconWidth

                    val secondaryIconTop = 14 // This will act as a topPadding
                    val secondaryIconBottom = secondaryIconTop + secondaryIconHeight

                    secondaryIcon.setBounds(
                            secondaryIconLeft, secondaryIconTop, secondaryIconRight, secondaryIconBottom
                    )
                    secondaryIcon.draw(canvas)

                    secondaryIcon.draw(canvas)
                } else {
                    val drawableX = (key.width - keyIcon.intrinsicWidth) / 2
                    val drawableY = (key.height - keyIcon.intrinsicHeight) / 2
                    canvas.translate(drawableX.toFloat(), drawableY.toFloat())
                    keyIcon.setBounds(0, 0, keyIcon.intrinsicWidth, keyIcon.intrinsicHeight)
                    keyIcon.draw(canvas)
                    canvas.translate(-drawableX.toFloat(), -drawableY.toFloat())
                }
            }
            canvas.translate(-key.x.toFloat(), -key.y.toFloat())
        }

        // Overlay a dark rectangle to dim the keyboard
        if (mMiniKeyboardOnScreen) {
            paint.color = Color.BLACK.adjustAlpha(0.3f)
            canvas.drawRect(0f, 0f, width.toFloat(), height.toFloat(), paint)
        }

        mCanvas!!.restore()
        mDrawPending = false
        mDirtyRect.setEmpty()
    }

    private fun setupKeyBackground(key: MyKeyboard.Key, keyCode: Int, canvas: Canvas) {
        val keyBackground = when {
            keyCode == KEYCODE_SPACE && key.label.isBlank() -> getSpaceKeyBackground()
            keyCode == KEYCODE_SPACE_N && key.label.isBlank() -> getSpaceKeyBackground()
            keyCode == KEYCODE_ENTER -> getEnterKeyBackground()
            else -> mKeyBackground
        }

        val bounds = keyBackground!!.bounds
        if (key.width != bounds.right || key.height != bounds.bottom) {
            keyBackground.setBounds(0, 0, key.width, key.height)
        }

        keyBackground.state = when {
            key.pressed -> intArrayOf(android.R.attr.state_pressed)
            key.focused -> intArrayOf(android.R.attr.state_focused)
            else -> intArrayOf()
        }

        if (key.focused || keyCode == KEYCODE_ENTER) {
            val keyColor = if (key.pressed) {
                mPrimaryColor.adjustAlpha(0.8f)
            } else {
                R.color.md_grey_white
            }
            keyBackground.applyColorFilter(Color.GRAY)
        } else if (mShowKeyBorders) {
            if (keyCode == KEYCODE_SPACE || !mUsingSystemTheme) {
                val keyColor = if (key.pressed) {
                    mKeyColorPressed
                } else {
                    mKeyColor
                }
                keyBackground.applyColorFilter(Color.TRANSPARENT)
            }
            if (keyCode == KEYCODE_SPACE_N || !mUsingSystemTheme) {
                val keyColor = if (key.pressed) {
                    mKeyColorPressed
                } else {
                    mKeyColor
                }
                keyBackground.applyColorFilter(Color.TRANSPARENT)
            }
        }

        canvas.translate(key.x.toFloat(), key.y.toFloat())
        keyBackground.draw(canvas)
    }

    private fun getSpaceKeyBackground(): Drawable? {
        val drawableId = if (mUsingSystemTheme) {
            if (mShowKeyBorders) {
                R.drawable.keyboard_space_background_material_outlined
            } else {
                R.drawable.keyboard_space_background_material_outlined
            }
        } else {
            if (mShowKeyBorders) {
                R.drawable.keyboard_key_selector_outlined
            } else {
                R.drawable.keyboard_space_background
            }
        }
        return resources.getDrawable(drawableId, context.theme)
    }


    private fun getEnterKeyBackground(): Drawable? {
        val drawableId = if (mShowKeyBorders) {
            R.drawable.keyboard_enter_background_outlined
        } else {
            R.drawable.keyboard_enter_background
        }
        return resources.getDrawable(drawableId, context.theme)
    }

//    private fun handleClipboard() {
//        if (mToolbarHolder != null && mPopupParent.id != R.id.mini_keyboard_view && context.config.showClipboardContent) {
//            val clipboardContent = context.getCurrentClip()
//            if (clipboardContent?.isNotEmpty() == true) {
//                closeSuggestionBox()
////                mToolbarHolder?.apply {
////                    clipboard_value.apply {
////                        text = clipboardContent
////                        removeUnderlines()
////                        setOnClickListener {
////                            mOnKeyboardActionListener!!.onText(clipboardContent.toString())
////                            vibrateIfNeeded()
////                        }
////                    }
////
////                    toggleClipboardVisibility(true)
////                }
//            } else {
//                hideClipboardViews()
//            }
//        } else {
//            hideClipboardViews()
//        }
//    }

    fun handleTool() {
        if (mSuggHolder != null && mPopupParent.id != R.id.mini_keyboard_view && mMicHolder != null) {
            mToolHolder?.apply {
                runOnUiThread {
                    findViewById<ImageView>(R.id.tool_back)?.setOnClickListener {
                        closeTool()
                        openSuggestionBox()
                    }
                    findViewById<ImageView>(R.id.ic_microphone).setOnClickListener {
                        startSpeechToText()
                        mMicHolder?.findViewById<RelativeLayout>(R.id.microphone_holder)?.visibility = VISIBLE
                        closeTool()
                        closeSuggestionBox()
                        closeEmojiSuggestionBox()
                        closeClipboardManager()
                    }
                }
            }
        }
    }

    fun openEmoji(inputConnection: InputConnection) {
        mSuggEmojiHolder?.apply {
            findViewById<LinearLayout>(R.id.sugg_emoji_holder)?.visibility = View.VISIBLE
            val emoji = sharedPreferences.getString("current_emoji", "")
            val listType = object : TypeToken<List<String>>() {}.type
            val stringList = Gson().fromJson<List<String>>(emoji, listType)

            val emojiTextViews = listOf(findViewById<TextView>(R.id.sugg1_e), findViewById<TextView>(R.id.sugg2_e), findViewById<TextView>(R.id.sugg3_e), findViewById<TextView>(R.id.sugg4_e), findViewById<TextView>(R.id.sugg5_e), findViewById<TextView>(R.id.sugg6_e), findViewById<TextView>(R.id.sugg7_e), findViewById<TextView>(R.id.sugg8_e), findViewById<TextView>(R.id.sugg9_e), findViewById<TextView>(R.id.sugg10_e))


            for (index in 0 until emojiTextViews.size) {
                val emojiTextView = emojiTextViews[index]
                if (index < stringList.size) {
                    emojiTextView.text = stringList[index]
                    emojiTextView.setOnClickListener {
                        val textBeforeCursor = inputConnection.getTextBeforeCursor(10000, 0)
                        wordBeforeCursor = textBeforeCursor?.let { extractWordBeforeCursor(it) }!!
                        if (wordBeforeCursor != null) {
                            replaceWordBeforeCursor(inputConnection, wordBeforeCursor, stringList[index])
                        } else {
                            mOnKeyboardActionListener?.onText(stringList[index])
                        }
                        //mOnKeyboardActionListener?.onText(stringList[index])
                        mOnKeyboardActionListener?.onKey(32) // Space key
                        vibrateIfNeeded()
                    }
                } else {
                    emojiTextView.text = "" // Clear any remaining TextViews
                }
            }
        }
    }


    fun handleSuggestions(suggestions: List<WordSuggestion>, inputConnection: InputConnection) {
        val editor = sharedPreferences.edit()
        editor.putString("hlo_string", suggestions.toString())
        editor.apply()
        // currentInputconnection?.let { modifyEditorInfo(it) }

        if (mSuggHolder != null && mPopupParent.id != R.id.mini_keyboard_view) {
            mSuggHolder?.apply {
                suggestions.mapIndexed { index, suggestion ->
                    if (index == 0) {
                        findViewById<TextView>(R.id.sugg1).apply {
                            runOnUiThread {
                                val Concat_word = sharedPreferences.getString("Concat_word", "")
                                text = suggestion.word
                                print_sugg1 = suggestion.word.replace(Concat_word.toString().toLowerCase(), "")
                                val emoji = sharedPreferences.getString("current_emoji", "")
                                val listType = object : TypeToken<List<String>>() {}.type
                                val stringList = Gson().fromJson<List<String>>(emoji, listType)
                                Log.d("List of Emoji's:", "" + emoji)
                                text = suggestion.word
                                removeUnderlines()
                                setOnClickListener {
                                    val textBeforeCursor = inputConnection.getTextBeforeCursor(10000, 0)
                                    wordBeforeCursor = textBeforeCursor?.let { extractWordBeforeCursor(it) }!!
                                    if (wordBeforeCursor != null) {
                                        replaceWordBeforeCursor(inputConnection, wordBeforeCursor, suggestion.word)
                                    }
//                                        mOnKeyboardActionListener!!.onText(suggestion.word)
                                    mOnKeyboardActionListener!!.onKey(32)
                                    vibrateIfNeeded()
                                }


                            }
                        }
                    }
                    if (index == 1) {
                        findViewById<TextView>(R.id.sugg2).apply {
                            runOnUiThread {
                                runOnUiThread {
                                    val stringUser = sharedPreferences.getString("hlo_string", "")
                                    val Concat_word = sharedPreferences.getString("Concat_word", "")
                                    text = suggestion.word
                                    print_sugg2 = suggestion.word.replace(
                                            Concat_word.toString().toLowerCase(), ""
                                    )
                                    val emoji = sharedPreferences.getString("current_emoji", "")
                                    val listType = object : TypeToken<List<String>>() {}.type
                                    val stringList = Gson().fromJson<List<String>>(emoji, listType)
                                    Log.d("List of Emoji's:", "" + emoji)
                                    text = suggestion.word
                                    removeUnderlines()
                                    setOnClickListener {
                                        val textBeforeCursor = inputConnection.getTextBeforeCursor(10000, 0)
                                        wordBeforeCursor = textBeforeCursor?.let { extractWordBeforeCursor(it) }!!
                                        if (wordBeforeCursor != null) {
                                            replaceWordBeforeCursor(inputConnection, wordBeforeCursor, suggestion.word)
                                        }
                                        // mOnKeyboardActionListener!!.onText(print_sugg1)
                                        mOnKeyboardActionListener!!.onKey(32)
                                    }
                                }
                            }
                        }
                    }

                    if (index == 2) {
                        findViewById<TextView>(R.id.sugg3).apply {
                            runOnUiThread {
                                val stringUser = sharedPreferences.getString("hlo_string", "")
                                Log.d("PPPP", "$stringUser")
                                val Concat_word = sharedPreferences.getString("Concat_word", "")
                                text = suggestion.word
                                print_sugg3 = suggestion.word.replace(
                                        Concat_word.toString().toLowerCase(), ""
                                )
                                val emoji = sharedPreferences.getString("current_emoji", "")
                                val listType = object : TypeToken<List<String>>() {}.type
                                val stringList = Gson().fromJson<List<String>>(emoji, listType)
                                Log.d("List of Emoji's:", "" + emoji)
                                if (stringList.size >= 4) {
                                    openEmoji(inputConnection)
                                }
                                text = suggestion.word
                                removeUnderlines()
                                setOnClickListener {
                                    val textBeforeCursor = inputConnection.getTextBeforeCursor(10000, 0)
                                    wordBeforeCursor = textBeforeCursor?.let { extractWordBeforeCursor(it) }!!
                                    if (wordBeforeCursor != null) {
                                        replaceWordBeforeCursor(inputConnection, wordBeforeCursor, suggestion.word)
                                    }
                                    //mOnKeyboardActionListener!!.onText(print_sugg1)
                                    mOnKeyboardActionListener!!.onKey(32)
                                    vibrateIfNeeded()
                                }
                            }
                        }
                    }
                    if (index == 3) {
                        findViewById<TextView>(R.id.sugg4).apply {
                            runOnUiThread {
                                Log.d("PPP", "" + suggestion)
                                Log.d("PPP", "" + index)
                                runOnUiThread {
//                                    val print_sugg3: String
                                    val stringUser = sharedPreferences.getString("hlo_string", "")
                                    Log.d("PPPP", "$stringUser")
                                    val Concat_word = sharedPreferences.getString("Concat_word", "")
                                    text = suggestion.word
                                    print_sugg4 = suggestion.word.replace(
                                            Concat_word.toString().toLowerCase(), ""
                                    )

                                    removeUnderlines()
                                    setOnClickListener {
                                        val textBeforeCursor = inputConnection.getTextBeforeCursor(10000, 0)
                                        wordBeforeCursor = textBeforeCursor?.let { extractWordBeforeCursor(it) }!!
                                        if (wordBeforeCursor != null) {
                                            replaceWordBeforeCursor(inputConnection, wordBeforeCursor, suggestion.word)
                                        }
                                        //mOnKeyboardActionListener!!.onText(print_sugg4)
                                        mOnKeyboardActionListener!!.onKey(32)
                                        vibrateIfNeeded()
                                    }
                                }
                            }
                        }
                    }
                    if (index == 4) {
                        findViewById<TextView>(R.id.sugg5).apply {
                            runOnUiThread {
                                Log.d("PPP", "" + suggestion)
                                Log.d("PPP", "" + index)
                                runOnUiThread {
//                                    val print_sugg3: String
                                    val stringUser = sharedPreferences.getString("hlo_string", "")
                                    Log.d("PPPP", "$stringUser")
                                    val Concat_word = sharedPreferences.getString("Concat_word", "")
                                    text = suggestion.word
                                    print_sugg5 = suggestion.word.replace(
                                            Concat_word.toString().toLowerCase(), ""
                                    )

                                    removeUnderlines()
                                    setOnClickListener {
                                        val textBeforeCursor = inputConnection.getTextBeforeCursor(10000, 0)
                                        wordBeforeCursor = textBeforeCursor?.let { extractWordBeforeCursor(it) }!!
                                        if (wordBeforeCursor != null) {
                                            replaceWordBeforeCursor(inputConnection, wordBeforeCursor, suggestion.word)
                                        }
                                        //mOnKeyboardActionListener!!.onText(print_sugg5)
                                        mOnKeyboardActionListener!!.onKey(32)
                                        vibrateIfNeeded()
                                    }
                                }
                            }
                        }
                    }
                    if (index == 5) {
                        findViewById<TextView>(R.id.sugg6).apply {
                            runOnUiThread {
                                Log.d("PPP", "" + suggestion)
                                Log.d("PPP", "" + index)
                                runOnUiThread {
//                                    val print_sugg3: String
                                    val stringUser = sharedPreferences.getString("hlo_string", "")
                                    Log.d("PPPP", "$stringUser")
                                    val Concat_word = sharedPreferences.getString("Concat_word", "")
                                    text = suggestion.word
                                    print_sugg6 = suggestion.word.replace(
                                            Concat_word.toString().toLowerCase(), ""
                                    )

                                    removeUnderlines()
                                    setOnClickListener {
                                        val textBeforeCursor = inputConnection.getTextBeforeCursor(10000, 0)
                                        wordBeforeCursor = textBeforeCursor?.let { extractWordBeforeCursor(it) }!!
                                        if (wordBeforeCursor != null) {
                                            replaceWordBeforeCursor(inputConnection, wordBeforeCursor, suggestion.word)
                                        }
                                        //mOnKeyboardActionListener!!.onText(print_sugg6)
                                        mOnKeyboardActionListener!!.onKey(32)
                                        vibrateIfNeeded()
                                    }
                                }
                            }
                        }
                    }
                    if (index == 6) {
                        findViewById<TextView>(R.id.sugg7).apply {
                            runOnUiThread {
                                Log.d("PPP", "" + suggestion)
                                Log.d("PPP", "" + index)
                                runOnUiThread {
//                                    val print_sugg3: String
                                    val stringUser = sharedPreferences.getString("hlo_string", "")
                                    Log.d("PPPP", "$stringUser")
                                    val Concat_word = sharedPreferences.getString("Concat_word", "")
                                    text = suggestion.word
                                    print_sugg7 = suggestion.word.replace(
                                            Concat_word.toString().toLowerCase(), ""
                                    )

                                    removeUnderlines()
                                    setOnClickListener {
                                        val textBeforeCursor = inputConnection.getTextBeforeCursor(10000, 0)
                                        wordBeforeCursor = textBeforeCursor?.let { extractWordBeforeCursor(it) }!!
                                        if (wordBeforeCursor != null) {
                                            replaceWordBeforeCursor(inputConnection, wordBeforeCursor, suggestion.word)
                                        }
                                        //mOnKeyboardActionListener!!.onText(print_sugg7)
                                        mOnKeyboardActionListener!!.onKey(32)
                                        vibrateIfNeeded()
                                    }
                                }
                            }
                        }
                    }
                    if (index == 7) {
                        findViewById<TextView>(R.id.sugg8).apply {
                            runOnUiThread {
                                Log.d("PPP", "" + suggestion)
                                Log.d("PPP", "" + index)
                                runOnUiThread {
//                                    val print_sugg3: String
                                    val stringUser = sharedPreferences.getString("hlo_string", "")
                                    Log.d("PPPP", "$stringUser")
                                    val Concat_word = sharedPreferences.getString("Concat_word", "")
                                    text = suggestion.word
                                    print_sugg8 = suggestion.word.replace(
                                            Concat_word.toString().toLowerCase(), ""
                                    )

                                    removeUnderlines()
                                    setOnClickListener {
                                        val textBeforeCursor = inputConnection.getTextBeforeCursor(10000, 0)
                                        wordBeforeCursor = textBeforeCursor?.let { extractWordBeforeCursor(it) }!!
                                        if (wordBeforeCursor != null) {
                                            replaceWordBeforeCursor(inputConnection, wordBeforeCursor, suggestion.word)
                                        }
                                        // mOnKeyboardActionListener!!.onText(print_sugg8)
                                        mOnKeyboardActionListener!!.onKey(32)
                                        vibrateIfNeeded()
                                    }
                                }
                            }
                        }
                    }
                    if (index == 8) {
                        findViewById<TextView>(R.id.sugg9).apply {
                            runOnUiThread {
                                Log.d("PPP", "" + suggestion)
                                Log.d("PPP", "" + index)
                                runOnUiThread {
//                                    val print_sugg3: String
                                    val stringUser = sharedPreferences.getString("hlo_string", "")
                                    Log.d("PPPP", "$stringUser")
                                    val Concat_word = sharedPreferences.getString("Concat_word", "")
                                    text = suggestion.word
                                    print_sugg9 = suggestion.word.replace(
                                            Concat_word.toString().toLowerCase(), ""
                                    )

                                    removeUnderlines()
                                    setOnClickListener {
                                        val textBeforeCursor = inputConnection.getTextBeforeCursor(10000, 0)
                                        wordBeforeCursor = textBeforeCursor?.let { extractWordBeforeCursor(it) }!!
                                        if (wordBeforeCursor != null) {
                                            replaceWordBeforeCursor(inputConnection, wordBeforeCursor, suggestion.word)
                                        }
                                        //mOnKeyboardActionListener!!.onText(print_sugg9)
                                        mOnKeyboardActionListener!!.onKey(32)
                                        vibrateIfNeeded()
                                    }
                                }
                            }
                        }
                    }
                    if (index == 9) {
                        findViewById<TextView>(R.id.sugg10).apply {
                            runOnUiThread {
                                Log.d("PPP", "" + suggestion)
                                Log.d("PPP", "" + index)
                                runOnUiThread {
//                                    val print_sugg3: String
                                    val stringUser = sharedPreferences.getString("hlo_string", "")
                                    Log.d("PPPP", "$stringUser")
                                    val Concat_word = sharedPreferences.getString("Concat_word", "")
                                    text = suggestion.word
                                    print_sugg10 = suggestion.word.replace(
                                            Concat_word.toString().toLowerCase(), ""
                                    )

                                    removeUnderlines()
                                    setOnClickListener {
                                        val textBeforeCursor = inputConnection.getTextBeforeCursor(10000, 0)
                                        wordBeforeCursor = textBeforeCursor?.let { extractWordBeforeCursor(it) }!!
                                        if (wordBeforeCursor != null) {
                                            replaceWordBeforeCursor(inputConnection, wordBeforeCursor, suggestion.word)
                                        }
                                        //mOnKeyboardActionListener!!.onText(print_sugg10)
                                        mOnKeyboardActionListener!!.onKey(32)
                                        vibrateIfNeeded()
                                    }
                                }
                            }
                        }
                    }
                }

                findViewById<ImageButton>(R.id.back).setOnClickListener {
                    closeSuggestionBox()
                    closeEmojiSuggestionBox()
                    openTool()
                }
            }
        }
    }

    private fun startSpeechToText() {
        if (PermissionHelper.checkRecordAudioPermission(context)) {
            val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH)
            intent.putExtra(
                    RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM
            )
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault())
            intent.putExtra(RecognizerIntent.EXTRA_PROMPT, "Speak now")
            speechRecognizer?.startListening(intent)
            mUsingMic == true
        } else {
            context.toast("Enable Audio Permission")
        }
    }

    private fun clearClipboardContent() {
        val clipboardManager =
                (context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager)
        if (isPiePlus()) {
            clipboardManager.clearPrimaryClip()
        } else {
            val clip = ClipData.newPlainText("", "")
            clipboardManager.setPrimaryClip(clip)
        }
    }

//    private fun toggleClipboardVisibility(show: Boolean) {
//        if ((show && mToolbarHolder?.clipboard_value_holder!!.alpha == 0f) || (!show && mToolbarHolder?.clipboard_value_holder!!.alpha == 1f)) {
//            val newAlpha = if (show) 1f else 0f
//            val animations = ArrayList<ObjectAnimator>()
//            val clipboardValueAnimation =
//                ObjectAnimator.ofFloat(mToolbarHolder!!.clipboard_value_holder!!, "alpha", newAlpha)
//            animations.add(clipboardValueAnimation)
//
//            val clipboardClearAnimation =
//                ObjectAnimator.ofFloat(mToolbarHolder!!.clipboard_clear!!, "alpha", newAlpha)
//            animations.add(clipboardClearAnimation)
//
//            val animSet = AnimatorSet()
//            animSet.playTogether(*animations.toTypedArray())
//            animSet.duration = 150
//            animSet.interpolator = AccelerateInterpolator()
//            animSet.doOnStart {
//                if (show) {
//                    mToolbarHolder?.clipboard_value_holder?.beVisible()
//                    mToolbarHolder?.clipboard_clear?.beVisible()
//                }
//            }
//            animSet.doOnEnd {
//                if (!show) {
//                    mToolbarHolder?.clipboard_value_holder?.beGone()
//                    mToolbarHolder?.clipboard_clear?.beGone()
//                }
//            }
//            animSet.start()
//        }
//    }

    private fun getPressedKeyIndex(x: Int, y: Int): Int {
        return mKeys.indexOfFirst {
            it.isInside(x, y)
        }
    }

    private fun detectAndSendKey(index: Int, x: Int, y: Int, eventTime: Long) {
        if (index != NOT_A_KEY && index < mKeys.size) {
            val key = mKeys[index]
            getPressedKeyIndex(x, y)
            mOnKeyboardActionListener!!.onKey(key.code)
            mLastTapTime = eventTime
        }
    }

    private fun showPreview(keyIndex: Int) {
        val oldKeyIndex = mCurrentKeyIndex
        val previewPopup = mPreviewPopup
        mCurrentKeyIndex = keyIndex
        // Release the old key and press the new key
        val keys = mKeys
        if (oldKeyIndex != mCurrentKeyIndex) {
            if (oldKeyIndex != NOT_A_KEY && keys.size > oldKeyIndex) {
                val oldKey = keys[oldKeyIndex]
                oldKey.pressed = false
                invalidateKey(oldKeyIndex)
                val keyCode = oldKey.code
                sendAccessibilityEventForUnicodeCharacter(
                        AccessibilityEvent.TYPE_VIEW_ACCESSIBILITY_FOCUS_CLEARED, keyCode
                )
            }

            if (mCurrentKeyIndex != NOT_A_KEY && keys.size > mCurrentKeyIndex) {
                val newKey = keys[mCurrentKeyIndex]

                val code = newKey.code
                if (context.config.showKeyBorders || (code == KEYCODE_SHIFT || code == KEYCODE_MODE_CHANGE || code == KEYCODE_DELETE || code == KEYCODE_ENTER || code == KEYCODE_SPACE || code == KEYCODE_SPACE_N)) {
                    newKey.pressed = true
                }

                invalidateKey(mCurrentKeyIndex)
                sendAccessibilityEventForUnicodeCharacter(
                        AccessibilityEvent.TYPE_VIEW_ACCESSIBILITY_FOCUSED, code
                )
            }
        }

        if (!context.config.showPopupOnKeypress) {
            return
        }

        // If key changed and preview is on ...
        if (oldKeyIndex != mCurrentKeyIndex) {
            if (previewPopup.isShowing) {
                if (keyIndex == NOT_A_KEY) {
                    mHandler!!.sendMessageDelayed(
                            mHandler!!.obtainMessage(MSG_REMOVE_PREVIEW), DELAY_AFTER_PREVIEW.toLong()
                    )
                }
            }

            if (keyIndex != NOT_A_KEY) {
                showKey(keyIndex)
            }
        }
    }

    private fun showKey(keyIndex: Int) {
        val previewPopup = mPreviewPopup
        val keys = mKeys
        if (keyIndex < 0 || keyIndex >= mKeys.size) {
            return
        }

        val key = keys[keyIndex]
        if (key.icon != null) {
            mPreviewText!!.setCompoundDrawables(null, null, null, key.icon)
        } else {
            if (key.label.length > 1) {
                mPreviewText!!.setTextSize(
                        TypedValue.COMPLEX_UNIT_PX, mKeyTextSize.toFloat()
                )
                mPreviewText!!.typeface = Typeface.DEFAULT_BOLD
            } else {
                mPreviewText!!.setTextSize(
                        TypedValue.COMPLEX_UNIT_PX, mPreviewTextSizeLarge.toFloat()
                )
                mPreviewText!!.typeface = Typeface.DEFAULT
            }

            mPreviewText!!.setCompoundDrawables(null, null, null, null)
            try {
                mPreviewText!!.text = adjustCase(key.label)
            } catch (ignored: Exception) {
            }
        }

        val previewBackgroundColor = context.getProperToolBarBackgroundColor()

        val previewBackground = mPreviewText!!.background as LayerDrawable
        previewBackground.findDrawableByLayerId(R.id.button_background_shape)
                .applyColorFilter(previewBackgroundColor)
        previewBackground.findDrawableByLayerId(R.id.button_background_stroke)
                .applyColorFilter(context.getStrokeColor())
        mPreviewText!!.background = previewBackground

        mPreviewText!!.setTextColor(mTextColor)
        mPreviewText!!.measure(
                MeasureSpec.makeMeasureSpec(0, MeasureSpec.UNSPECIFIED),
                MeasureSpec.makeMeasureSpec(0, MeasureSpec.UNSPECIFIED)
        )
        val popupWidth = Math.max(mPreviewText!!.measuredWidth, key.width)
        val popupHeight = mPreviewHeight
        val lp = mPreviewText!!.layoutParams
        lp?.width = popupWidth
        lp?.height = popupHeight

        mPopupPreviewX = key.x
        mPopupPreviewY = key.y - popupHeight

        mHandler!!.removeMessages(MSG_REMOVE_PREVIEW)
        getLocationInWindow(mCoordinates)
        mCoordinates[0] += mMiniKeyboardOffsetX // Offset may be zero
        mCoordinates[1] += mMiniKeyboardOffsetY // Offset may be zero

        // Set the preview background state
        mPreviewText!!.background.state = if (key.popupResId != 0) {
            LONG_PRESSABLE_STATE_SET
        } else {
            EMPTY_STATE_SET
        }

        mPopupPreviewX += mCoordinates[0]
        mPopupPreviewY += mCoordinates[1]

        // If the popup cannot be shown above the key, put it on the side
        getLocationOnScreen(mCoordinates)
        if (mPopupPreviewY + mCoordinates[1] < 0) {
            // If the key you're pressing is on the left side of the keyboard, show the popup on
            // the right, offset by enough to see at least one key to the left/right.
            if (key.x + key.width <= width / 2) {
                mPopupPreviewX += (key.width * 2.5).toInt()
            } else {
                mPopupPreviewX -= (key.width * 2.5).toInt()
            }
            mPopupPreviewY += popupHeight
        }

        previewPopup.dismiss()

        if (key.label.isNotEmpty() && key.code != KEYCODE_MODE_CHANGE && key.code != KEYCODE_SHIFT) {
            previewPopup.width = popupWidth
            previewPopup.height = popupHeight
            previewPopup.showAtLocation(
                    mPopupParent, Gravity.NO_GRAVITY, mPopupPreviewX, mPopupPreviewY
            )
            mPreviewText!!.visibility = VISIBLE
        }
    }

    private fun sendAccessibilityEventForUnicodeCharacter(eventType: Int, code: Int) {
        if (mAccessibilityManager.isEnabled) {
            val event = AccessibilityEvent.obtain(eventType)
            onInitializeAccessibilityEvent(event)
            val text: String = when (code) {
                KEYCODE_DELETE -> context.getString(R.string.keycode_delete)
                KEYCODE_ENTER -> context.getString(R.string.keycode_enter)
                KEYCODE_MODE_CHANGE -> context.getString(R.string.keycode_mode_change)
                KEYCODE_SHIFT -> context.getString(R.string.keycode_shift)
                else -> code.toChar().toString()
            }
            event.text.add(text)
            mAccessibilityManager.sendAccessibilityEvent(event)
        }
    }

    /**
     * Requests a redraw of the entire keyboard. Calling [.invalidate] is not sufficient because the keyboard renders the keys to an off-screen buffer and
     * an invalidate() only draws the cached buffer.
     */
    fun invalidateAllKeys() {
        mDirtyRect.union(0, 0, width, height)
        mDrawPending = true
        invalidate()
    }

    /**
     * Invalidates a key so that it will be redrawn on the next repaint. Use this method if only one key is changing it's content. Any changes that
     * affect the position or size of the key may not be honored.
     * @param keyIndex the index of the key in the attached [MyKeyboard].
     */
    private fun invalidateKey(keyIndex: Int) {
        if (keyIndex < 0 || keyIndex >= mKeys.size) {
            return
        }

        val key = mKeys[keyIndex]
        mDirtyRect.union(
                key.x, key.y, key.x + key.width, key.y + key.height
        )
        onBufferDraw()
        invalidate(
                key.x, key.y, key.x + key.width, key.y + key.height
        )
    }

    private fun openPopupIfRequired(me: MotionEvent): Boolean {
        // Check if we have a popup layout specified first.
        if (mPopupLayout == 0) {
            return false
        }

        if (mCurrentKey < 0 || mCurrentKey >= mKeys.size) {
            return false
        }

        val popupKey = mKeys[mCurrentKey]
        val result = onLongPress(popupKey, me)
        if (result) {
            mAbortKey = true
            showPreview(NOT_A_KEY)
        }

        return result
    }

    /**
     * Called when a key is long pressed. By default this will open any popup keyboard associated with this key through the attributes
     * popupLayout and popupCharacters.
     * @param popupKey the key that was long pressed
     * @return true if the long press is handled, false otherwise. Subclasses should call the method on the base class if the subclass doesn't wish to
     * handle the call.
     */
    private fun onLongPress(popupKey: MyKeyboard.Key, me: MotionEvent): Boolean {
        if (popupKey.code == KEYCODE_EMOJI) {
//            ChangeLanguagePopup(this, onSelect = {
//                mOnKeyboardActionListener?.reloadKeyboard()
//            })
            return true
        } else {
            val popupKeyboardId = popupKey.popupResId
            if (popupKeyboardId != 0) {
                mMiniKeyboardContainer = mMiniKeyboardCache[popupKey]
                if (mMiniKeyboardContainer == null) {
                    val inflater =
                            context.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
                    mMiniKeyboardContainer = inflater.inflate(mPopupLayout, null)
                    mMiniKeyboard =
                            mMiniKeyboardContainer!!.findViewById<View>(R.id.mini_keyboard_view) as MyKeyboardView

                    mMiniKeyboard!!.mOnKeyboardActionListener = object : OnKeyboardActionListener {
                        override fun onKey(code: Int) {
                            mOnKeyboardActionListener!!.onKey(code)
                            dismissPopupKeyboard()
                        }

                        override fun commitGifImage(contentUri: Uri, imageDescription: String) {

                        }

                        override fun onPress(primaryCode: Int) {
                            mOnKeyboardActionListener!!.onPress(primaryCode)
                        }

                        override fun onActionUp() {
                            mOnKeyboardActionListener!!.onActionUp()
                        }

                        override fun moveCursorLeft() {
                            mOnKeyboardActionListener!!.moveCursorLeft()
                        }

                        override fun moveCursorRight() {
                            mOnKeyboardActionListener!!.moveCursorRight()
                        }

                        override fun onText(text: String) {
                            mOnKeyboardActionListener!!.onText(text)
                        }

                        override fun reloadKeyboard() {
                            mOnKeyboardActionListener!!.reloadKeyboard()
                        }

                        override fun onSearchClicked(enabled: Boolean) {
                            mOnKeyboardActionListener!!.onSearchClicked(enabled)
                        }

                        override fun onSearchText(text: String) {
                            mOnKeyboardActionListener!!.onSearchText(text)
                        }

                        override fun ClearConnection() {
                            mOnKeyboardActionListener!!.ClearConnection()
                        }


                        override fun onUpdateSelection(
                                oldSelStart: Int,
                                oldSelEnd: Int,
                                newSelStart: Int,
                                newSelEnd: Int,
                                candidatesStart: Int,
                                candidatesEnd: Int
                        ) {
                            mOnKeyboardActionListener!!.onUpdateSelection(
                                    oldSelStart,
                                    oldSelEnd,
                                    newSelStart,
                                    newSelEnd,
                                    candidatesStart,
                                    candidatesEnd
                            )
                        }
                    }

                    val keyboard = if (popupKey.popupCharacters != null) {
                        MyKeyboard(
                                context, popupKeyboardId, popupKey.popupCharacters!!, popupKey.width
                        )
                    } else {
                        MyKeyboard(context, popupKeyboardId, 0)
                    }

                    mMiniKeyboard!!.setKeyboard(keyboard)
                    mPopupParent = this
                    mMiniKeyboardContainer!!.measure(
                            MeasureSpec.makeMeasureSpec(width, MeasureSpec.AT_MOST),
                            MeasureSpec.makeMeasureSpec(height, MeasureSpec.AT_MOST)
                    )
                    mMiniKeyboardCache[popupKey] = mMiniKeyboardContainer
                } else {
                    mMiniKeyboard =
                            mMiniKeyboardContainer!!.findViewById<View>(R.id.mini_keyboard_view) as MyKeyboardView
                }

                getLocationInWindow(mCoordinates)
                mPopupX = popupKey.x
                mPopupY = popupKey.y

                val widthToUse =
                        mMiniKeyboardContainer!!.measuredWidth - (popupKey.popupCharacters!!.length / 2) * popupKey.width
                mPopupX = mPopupX + popupKey.width - widthToUse
                mPopupY -= mMiniKeyboardContainer!!.measuredHeight
                val x = mPopupX + mCoordinates[0]
                val y = mPopupY + mCoordinates[1]
                val xOffset = Math.max(0, x)
                mMiniKeyboard!!.setPopupOffset(xOffset, y)

                // make sure we highlight the proper key right after long pressing it, before any ACTION_MOVE event occurs
                val miniKeyboardX = if (xOffset + mMiniKeyboard!!.measuredWidth <= measuredWidth) {
                    xOffset
                } else {
                    measuredWidth - mMiniKeyboard!!.measuredWidth
                }

                val keysCnt = mMiniKeyboard!!.mKeys.size
                var selectedKeyIndex =
                        Math.floor((me.x - miniKeyboardX) / popupKey.width.toDouble()).toInt()
                if (keysCnt > MAX_KEYS_PER_MINI_ROW) {
                    selectedKeyIndex += MAX_KEYS_PER_MINI_ROW
                }
                selectedKeyIndex = Math.max(0, Math.min(selectedKeyIndex, keysCnt - 1))

                for (i in 0 until keysCnt) {
                    mMiniKeyboard!!.mKeys[i].focused = i == selectedKeyIndex
                }

                mMiniKeyboardSelectedKeyIndex = selectedKeyIndex
                mMiniKeyboard!!.invalidateAllKeys()

                val miniShiftStatus = if (isShifted()) ShiftState.ON_PERMANENT else ShiftState.OFF
                mMiniKeyboard!!.setShifted(miniShiftStatus)
                mPopupKeyboard.contentView = mMiniKeyboardContainer
                mPopupKeyboard.width = mMiniKeyboardContainer!!.measuredWidth
                mPopupKeyboard.height = mMiniKeyboardContainer!!.measuredHeight
                mPopupKeyboard.showAtLocation(this, Gravity.NO_GRAVITY, x, y)
                mMiniKeyboardOnScreen = true
                invalidateAllKeys()
                return true
            }
        }
        return false
    }

    override fun onTouchEvent(me: MotionEvent): Boolean {
        val action = me.action

        if (ignoreTouches) {
            if (action == MotionEvent.ACTION_UP) {
                ignoreTouches = false

                // fix a glitch with long pressing backspace, then clicking some letter
                if (mRepeatKeyIndex != NOT_A_KEY) {
                    val key = mKeys[mRepeatKeyIndex]
                    if (key.code == KEYCODE_DELETE) {
                        mHandler?.removeMessages(MSG_REPEAT)
                        mRepeatKeyIndex = NOT_A_KEY
                    }
                }
            }
            return true
        }

        // handle moving between alternative popup characters by swiping
        if (mPopupKeyboard.isShowing) {
            when (action) {
                MotionEvent.ACTION_MOVE -> {
                    if (mMiniKeyboard != null) {
                        val coords = intArrayOf(0, 0)
                        mMiniKeyboard!!.getLocationOnScreen(coords)
                        val keysCnt = mMiniKeyboard!!.mKeys.size
                        val lastRowKeyCount = if (keysCnt > MAX_KEYS_PER_MINI_ROW) {
                            Math.max(keysCnt % MAX_KEYS_PER_MINI_ROW, 1)
                        } else {
                            keysCnt
                        }

                        val widthPerKey = if (keysCnt > MAX_KEYS_PER_MINI_ROW) {
                            mMiniKeyboard!!.width / MAX_KEYS_PER_MINI_ROW
                        } else {
                            mMiniKeyboard!!.width / lastRowKeyCount
                        }

                        var selectedKeyIndex =
                                Math.floor((me.x - coords[0]) / widthPerKey.toDouble()).toInt()
                        if (keysCnt > MAX_KEYS_PER_MINI_ROW) {
                            selectedKeyIndex = Math.max(0, selectedKeyIndex)
                            selectedKeyIndex += MAX_KEYS_PER_MINI_ROW
                        }

                        selectedKeyIndex = Math.max(0, Math.min(selectedKeyIndex, keysCnt - 1))
                        if (selectedKeyIndex != mMiniKeyboardSelectedKeyIndex) {
                            for (i in 0 until keysCnt) {
                                mMiniKeyboard!!.mKeys[i].focused = i == selectedKeyIndex
                            }
                            mMiniKeyboardSelectedKeyIndex = selectedKeyIndex
                            mMiniKeyboard!!.invalidateAllKeys()
                        }

                        if (coords[0] > 0 || coords[1] > 0) {
                            if (coords[0] - me.x > mPopupMaxMoveDistance ||                                         // left
                                    me.x - (coords[0] + mMiniKeyboard!!.measuredWidth) > mPopupMaxMoveDistance          // right
                            ) {
                                dismissPopupKeyboard()
                            }
                        }
                    }
                }

                MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                    mMiniKeyboard?.mKeys?.firstOrNull { it.focused }?.apply {
                        runOnUiThread {
                            mOnKeyboardActionListener!!.onKey(code)
                        }
                        mMiniKeyboardSelectedKeyIndex = -1
                        dismissPopupKeyboard()
                    }
                }
            }
        }

        return onModifiedTouchEvent(me)
    }


    private fun onModifiedTouchEvent(me: MotionEvent): Boolean {
        var touchX = me.x.toInt()
        var touchY = me.y.toInt()
        if (touchY >= -mVerticalCorrection) {
            touchY += mVerticalCorrection
        }

        val action = me.actionMasked
        val eventTime = me.eventTime
        val keyIndex = getPressedKeyIndex(touchX, touchY)

        // Ignore all motion events until a DOWN.
        if (mAbortKey && action != MotionEvent.ACTION_DOWN && action != MotionEvent.ACTION_CANCEL) {
            return true
        }

        // Needs to be called after the gesture detector gets a turn, as it may have displayed the mini keyboard
        if (mMiniKeyboardOnScreen && action != MotionEvent.ACTION_CANCEL) {
            return true
        }

        when (action) {
            MotionEvent.ACTION_POINTER_DOWN -> {
                // if the user presses a key while still holding down the previous, type in both chars and ignore the later gestures
                // can happen at fast typing, easier to reproduce by increasing LONGPRESS_TIMEOUT
                ignoreTouches = true
                mHandler!!.removeMessages(MSG_LONGPRESS)
                dismissPopupKeyboard()
                detectAndSendKey(keyIndex, me.x.toInt(), me.y.toInt(), eventTime)

                val newPointerX = me.getX(1).toInt()
                val newPointerY = me.getY(1).toInt()
                val secondKeyIndex = getPressedKeyIndex(newPointerX, newPointerY)
                showPreview(secondKeyIndex)
                detectAndSendKey(secondKeyIndex, newPointerX, newPointerY, eventTime)

                val secondKeyCode = mKeys.getOrNull(secondKeyIndex)?.code
                if (secondKeyCode != null) {
                    mOnKeyboardActionListener!!.onPress(secondKeyCode)
                }

                showPreview(NOT_A_KEY)
                invalidateKey(mCurrentKey)
                return true
            }

            MotionEvent.ACTION_DOWN -> {
                mAbortKey = false
                mLastCodeX = touchX
                mLastCodeY = touchY
                mLastKeyTime = 0
                mCurrentKeyTime = 0
                mLastKey = NOT_A_KEY
                mCurrentKey = keyIndex
                mDownTime = me.eventTime
                mLastMoveTime = mDownTime

                val onPressKey = if (keyIndex != NOT_A_KEY) {
                    mKeys[keyIndex].code
                } else {
                    0
                }
                mOnKeyboardActionListener!!.onPress(onPressKey)
                mLastKeyPressedCode = onPressKey

                var wasHandled = false
                if (mCurrentKey >= 0 && mKeys[mCurrentKey].repeatable) {
                    mRepeatKeyIndex = mCurrentKey

                    val msg = mHandler!!.obtainMessage(MSG_REPEAT)
                    mHandler!!.sendMessageDelayed(msg, REPEAT_START_DELAY.toLong())
                    // if the user long presses Space, move the cursor after swipine left/right
                    if (mKeys[mCurrentKey].code == KEYCODE_SPACE) {
                        mLastSpaceMoveX = -1
                    } else {
                        repeatKey(true)
                    }

                    // Delivering the key could have caused an abort
                    if (mAbortKey) {
                        mRepeatKeyIndex = NOT_A_KEY
                        wasHandled = true
                    }
                }

                if (!wasHandled && mCurrentKey != NOT_A_KEY) {
                    val msg = mHandler!!.obtainMessage(MSG_LONGPRESS, me)
                    mHandler!!.sendMessageDelayed(msg, LONGPRESS_TIMEOUT.toLong())
                }

                if (mPopupParent.id != R.id.mini_keyboard_view) {
                    showPreview(keyIndex)
                }
            }

            MotionEvent.ACTION_MOVE -> {
                var continueLongPress = false
                if (keyIndex != NOT_A_KEY) {
                    if (mCurrentKey == NOT_A_KEY) {
                        mCurrentKey = keyIndex
                        mCurrentKeyTime = eventTime - mDownTime
                    } else {
                        if (keyIndex == mCurrentKey) {
                            mCurrentKeyTime += eventTime - mLastMoveTime
                            continueLongPress = true
                        } else if (mRepeatKeyIndex == NOT_A_KEY) {
                            mLastKey = mCurrentKey
                            mLastCodeX = mLastX
                            mLastCodeY = mLastY
                            mLastKeyTime = mCurrentKeyTime + eventTime - mLastMoveTime
                            mCurrentKey = keyIndex
                            mCurrentKeyTime = 0
                        }
                    }
                }

                if (mIsLongPressingSpace) {
                    if (mLastSpaceMoveX == -1) {
                        mLastSpaceMoveX = mLastX
                    }

                    val diff = mLastX - mLastSpaceMoveX
                    if (diff < -mSpaceMoveThreshold) {
                        for (i in diff / mSpaceMoveThreshold until 0) {
                            mOnKeyboardActionListener?.moveCursorLeft()
                        }
                        mLastSpaceMoveX = mLastX
                    } else if (diff > mSpaceMoveThreshold) {
                        for (i in 0 until diff / mSpaceMoveThreshold) {
                            mOnKeyboardActionListener?.moveCursorRight()
                        }
                        mLastSpaceMoveX = mLastX
                    }
                } else if (!continueLongPress) {
                    // Cancel old longpress
                    mHandler!!.removeMessages(MSG_LONGPRESS)
                    // Start new longpress if key has changed
                    if (keyIndex != NOT_A_KEY) {
                        val msg = mHandler!!.obtainMessage(MSG_LONGPRESS, me)
                        mHandler!!.sendMessageDelayed(msg, LONGPRESS_TIMEOUT.toLong())
                    }

                    if (mPopupParent.id != R.id.mini_keyboard_view) {
                        showPreview(mCurrentKey)
                    }
                    mLastMoveTime = eventTime
                }
            }

            MotionEvent.ACTION_UP -> {
                mLastSpaceMoveX = 0
                removeMessages()
                if (keyIndex == mCurrentKey) {
                    mCurrentKeyTime += eventTime - mLastMoveTime
                } else {
                    mLastKey = mCurrentKey
                    mLastKeyTime = mCurrentKeyTime + eventTime - mLastMoveTime
                    mCurrentKey = keyIndex
                    mCurrentKeyTime = 0
                }

                if (mCurrentKeyTime < mLastKeyTime && mCurrentKeyTime < DEBOUNCE_TIME && mLastKey != NOT_A_KEY) {
                    mCurrentKey = mLastKey
                    touchX = mLastCodeX
                    touchY = mLastCodeY
                }
                showPreview(NOT_A_KEY)
                Arrays.fill(mKeyIndices, NOT_A_KEY)
                // If we're not on a repeating key (which sends on a DOWN event)
                if (mRepeatKeyIndex == NOT_A_KEY && !mMiniKeyboardOnScreen && !mAbortKey) {
                    detectAndSendKey(mCurrentKey, touchX, touchY, eventTime)
                }

                if (mKeys.getOrNull(mCurrentKey)?.code == KEYCODE_SPACE && !mIsLongPressingSpace) {
                    detectAndSendKey(mCurrentKey, touchX, touchY, eventTime)
                }

                if (mLastKeyPressedCode != KEYCODE_MODE_CHANGE) {
                    invalidateKey(keyIndex)
                }
                mRepeatKeyIndex = NOT_A_KEY
                mOnKeyboardActionListener!!.onActionUp()
                mIsLongPressingSpace = false
            }

            MotionEvent.ACTION_CANCEL -> {
                mIsLongPressingSpace = false
                mLastSpaceMoveX = 0
                removeMessages()
                dismissPopupKeyboard()
                mAbortKey = true
                showPreview(NOT_A_KEY)
                invalidateKey(mCurrentKey)
            }
        }

        mLastX = touchX
        mLastY = touchY
        return true
    }

    private fun repeatKey(initialCall: Boolean): Boolean {
        val key = mKeys[mRepeatKeyIndex]
        if (!initialCall && key.code == KEYCODE_SPACE) {
            if (!mIsLongPressingSpace) {
                vibrateIfNeeded()
            }

            mIsLongPressingSpace = true
        } else {
            detectAndSendKey(mCurrentKey, key.x, key.y, mLastTapTime)
        }
        return true
    }

    fun closeClipboardManager() {
        mClipboardManagerHolder?.findViewById<RelativeLayout>(R.id.clipboard_manager_holder)?.beGone()
    }

    private fun openClipboardManager() {
        mClipboardManagerHolder!!.findViewById<RelativeLayout>(R.id.clipboard_manager_holder).beVisible()
        setupStoredClips()
    }

    private fun setupStoredClips() {
        ensureBackgroundThread {
            val clips = ArrayList<ListItem>()
            val clipboardContent = context.getCurrentClip()

            // Retrieve recent clips from the database and limit to the last 7 clips
            val recentClipsList = ArrayList(context.recentclipsDB.getRecentClips().takeLast(7))
            Log.d("Recent ClipList", "" + recentClipsList)

            clipboardContent?.let {
                if (!recentClipsList.any { it.value.trim() == clipboardContent.trim() }) {
                    // Add the current clipboard content to recent clips if it's not already there
                    val recentClip = RecentClip(null, clipboardContent)
                    context.recentclipsDB.insertOrUpdate(recentClip)
                    recentClipsList.add(recentClip)
                }
            }

            val pinnedClips = context.clipsDB.getClips()
            Log.d("Pinned Clips", "" + pinnedClips)
            val isCurrentClipPinnedToo =
                    pinnedClips.any { clipboardContent?.isNotEmpty() == true && it.value.trim() == clipboardContent }
            Log.d("isCurrentClipPinnedToo", "" + isCurrentClipPinnedToo)

            // Add recent clips to the list
            if (!isCurrentClipPinnedToo && recentClipsList.isNotEmpty()) {
                val recentSection =
                        ClipsSectionLabel(context.getString(R.string.clipboard_recent), false)
                clips.add(recentSection)

                for (recentClip in recentClipsList) {
                    val clip = Clip(recentClip.id, recentClip.value, false)
                    clips.add(clip)
                }
            }

            // Add the "Pinned Clips" section
            if (!isCurrentClipPinnedToo && clipboardContent?.isNotEmpty() == true) {
                val section = ClipsSectionLabel(context.getString(R.string.clipboard_pinned), false)
                clips.add(section)
                Log.d("SEction:", "" + section)
            }

            // Add pinned clips to the list
            clips.addAll(pinnedClips)

            Handler(Looper.getMainLooper()).post {
                setupClipsAdapter(clips)
            }
        }
    }


    private fun setupClipsAdapter(clips: ArrayList<ListItem>) {
        mClipboardManagerHolder?.apply {
            findViewById<TextView>(R.id.clipboard_content_placeholder_1).beVisibleIf(clips.isEmpty())
            findViewById<TextView>(R.id.clipboard_content_placeholder_2).beVisibleIf(clips.isEmpty())
            findViewById<MyRecyclerView>(R.id.clips_list).beVisibleIf(clips.isNotEmpty())
        }

        val refreshClipsListener = object : RefreshClipsListener {
            override fun refreshClips() {
                setupStoredClips()
            }
        }

        val adapter = ClipsKeyboardAdapter(context, clips, refreshClipsListener) { clip ->
            mOnKeyboardActionListener!!.onText(clip.value)
            vibrateIfNeeded()

        }

        mClipboardManagerHolder?.findViewById<MyRecyclerView>(R.id.clips_list)?.adapter = adapter
    }

    private fun switchToCategory(newIndex: Int) {
        currentCategoryIndex = newIndex
        updateCategory()
    }

    private fun updateCategory() {
        val newCategory = emojiCategories[currentCategoryIndex]
        emojiAdapter?.updateEmojis(newCategory.emojis)
        mEmojiPaletteHolder?.findViewById<RelativeLayout>(R.id.emoji_palette_holder)?.findViewById<TextView>(R.id.no_emoji)?.beGone()

    }

    private fun setupEmojiPalette(toolbarColor: Int, backgroundColor: Int, textColor: Int) {
        mEmojiPaletteHolder?.apply {
            findViewById<RelativeLayout>(R.id.emoji_palette_holder).background = ColorDrawable(backgroundColor)
            findViewById<ImageView>(R.id.emoji_palette_smile).applyColorFilter(mIconColor)
            findViewById<ImageView>(R.id.emoji_palette_people).applyColorFilter(mIconColor)
            findViewById<ImageView>(R.id.emoji_palette_food).applyColorFilter(mIconColor)
            findViewById<ImageView>(R.id.emoji_palette_city).applyColorFilter(mIconColor)
            findViewById<ImageView>(R.id.emoji_palette_recent).applyColorFilter(mIconColor)
            findViewById<ImageView>(R.id.emoji_palette_symbols).applyColorFilter(mIconColor)
            findViewById<ImageView>(R.id.emoji_palette_bulb).applyColorFilter(mIconColor)
            findViewById<ImageView>(R.id.emoji_palette_flag).applyColorFilter(mIconColor)
            findViewById<ImageView>(R.id.emoji_palette_winner).applyColorFilter(mIconColor)
            findViewById<ImageView>(R.id.emoji_palette_animal).applyColorFilter(mIconColor)
            findViewById<ImageView>(R.id.switch_to_gif).applyColorFilter(mIconColor)
            findViewById<ImageView>(R.id.switch_to_emoji).applyColorFilter(mIconColor)
            findViewById<ImageView>(R.id.switch_to_sticker).applyColorFilter(mIconColor)
//            runOnUiThread {
//                if (recentEmojis.size >= 0) {
//                    mEmojiPaletteHolder?.no_emoji?.isVisible()
//                } else {
//                    mEmojiPaletteHolder?.no_emoji?.isGone()
//                }
//            }
            val categoryIcons: List<ImageView> = listOf(
                    findViewById<ImageView>(R.id.emoji_palette_recent),
                    findViewById<ImageView>(R.id.emoji_palette_smile),
                    findViewById<ImageView>(R.id.emoji_palette_people),
                    findViewById<ImageView>(R.id.emoji_palette_animal),
                    findViewById<ImageView>(R.id.emoji_palette_food),
                    findViewById<ImageView>(R.id.emoji_palette_city),
                    findViewById<ImageView>(R.id.emoji_palette_winner),
                    findViewById<ImageView>(R.id.emoji_palette_bulb),
                    findViewById<ImageView>(R.id.emoji_palette_symbols),
                    findViewById<ImageView>(R.id.emoji_palette_flag)
            )


            findViewById<RelativeLayout>(R.id.emoji_palette_bottom_bar).background = ColorDrawable(backgroundColor)
            val bottomTextColor = textColor.darkenColor()
            findViewById<TextView>(R.id.emoji_palette_mode_change).apply {
                runOnUiThread {
                    setTextColor(bottomTextColor)
                    setOnClickListener {
                        vibrateIfNeeded()
                        closeEmojiPalette()
                    }
                }
            }
            categoryIcons.forEachIndexed { index, categoryIcon ->
                categoryIcon.applyColorFilter(mIconColor)
                categoryIcon.setOnClickListener {
                    switchToCategory(index)
                    categoryIcons.forEachIndexed { i, icon ->
                        icon.setBackgroundResource(if (i == index) R.drawable.vector_background else R.drawable.vector_background_unselected)
                    }
                }
            }

            findViewById<ImageButton>(R.id.switch_to_sticker).setOnClickListener {
                openStickerPalette()
                closeGIFPalette()
                closeEmojiSuggestionBox()
            }
            findViewById<ImageButton>(R.id.switch_to_gif).setOnClickListener {
                openGIFPalette()
                closeStickerPalette()
                closeEmojiSuggestionBox()
            }

            findViewById<ImageButton>(R.id.emoji_palette_backspace).apply {
                runOnUiThread {
                    applyColorFilter(bottomTextColor)
                    setOnTouchListener { _, event ->
                        when (event.action) {
                            MotionEvent.ACTION_DOWN -> {
                                isPressed = true
                                mRepeatKeyIndex = mKeys.indexOfFirst { it.code == KEYCODE_DELETE }
                                mCurrentKey = mRepeatKeyIndex
                                vibrateIfNeeded()
                                mOnKeyboardActionListener!!.onKey(KEYCODE_DELETE)
                                // setup repeating backspace
                                val msg = mHandler!!.obtainMessage(MSG_REPEAT)
                                mHandler!!.sendMessageDelayed(msg, REPEAT_START_DELAY.toLong())
                                true
                            }

                            MotionEvent.ACTION_UP -> {
                                mHandler!!.removeMessages(MSG_REPEAT)
                                mRepeatKeyIndex = NOT_A_KEY
                                isPressed = false
                                false
                            }

                            else -> false
                        }
                    }
                }
            }
        }
    }

    private fun EditSticker() {
        closeTool()
        findViewById<ConstraintLayout>(R.id.toolbar_holder)?.beGone()
    }

    private fun setupStickerPalette(
            toolbarColor: Int, backgroundColor: Int, textColor: Int
    ) {
        mStickerPaletteHolder?.apply {
            runOnUiThread {
//            sticker_palette_top_bar?.background = ColorDrawable(toolbarColor)
                findViewById<RelativeLayout>(R.id.sticker_palette_holder).background = ColorDrawable(backgroundColor)
                findViewById<TextView>(R.id.nervousSticker1).setTextColor(mIconColor)
                findViewById<TextView>(R.id.catSticker1).setTextColor(mIconColor)
                findViewById<TextView>(R.id.morningSticker1).setTextColor(mIconColor)
                findViewById<TextView>(R.id.lolSticker1).setTextColor(mIconColor)
                findViewById<TextView>(R.id.lazySticker1).setTextColor(mIconColor)
                findViewById<TextView>(R.id.stressedSticker1).setTextColor(mIconColor)
                findViewById<TextView>(R.id.happySticker1).setTextColor(mIconColor)
                findViewById<TextView>(R.id.sadSticker1).setTextColor(mIconColor)
                findViewById<TextView>(R.id.wowSticker1).setTextColor(mIconColor)
                findViewById<TextView>(R.id.oopsSticker1).setTextColor(mIconColor)
                findViewById<TextView>(R.id.welcomeSticker1).setTextColor(mIconColor)
                findViewById<ImageButton>(R.id.recentStickersButton1).applyColorFilter(mIconColor)
                findViewById<ImageButton>(R.id.switch_to_gif1).applyColorFilter(mIconColor)
                findViewById<ImageButton>(R.id.switch_to_emoji1).applyColorFilter(mIconColor)
                findViewById<ImageButton>(R.id.switch_to_sticker1).applyColorFilter(mIconColor)
                findViewById<RelativeLayout>(R.id.sticker_palette_bottom_bar).background = ColorDrawable(backgroundColor)
                val bottomTextColor = textColor.darkenColor()
                findViewById<TextView>(R.id.emoji_palette_mode_change1).apply {
                    runOnUiThread {
                        setTextColor(bottomTextColor)
                        setOnClickListener {
                            vibrateIfNeeded()
                            closeEmojiPalette()
                            closeStickerPalette()
                        }
                    }
                }

                findViewById<ImageButton>(R.id.switch_to_emoji1).setOnClickListener {
                    closeStickerPalette()
                    closeEmojiSuggestionBox()
                    vibrateIfNeeded()
                }
                findViewById<ImageButton>(R.id.switch_to_gif1).setOnClickListener {
                    openGIFPalette()
                    closeEmojiSuggestionBox()
                    vibrateIfNeeded()
                }

                findViewById<TextView>(R.id.nervousSticker1)?.setOnClickListener {
                    val searchText = "nervous"
                    if (searchText.isNotEmpty()) {
                        searchStickers(searchText)
                        Log.d("Touch Working", "")
                    }
                }
                findViewById<TextView>(R.id.catSticker1)?.setOnClickListener {
                    val searchText = "cat"
                    if (searchText.isNotEmpty()) {
                        searchStickers(searchText)
                        Log.d("Touch Working", "")
                    }
                }
                findViewById<TextView>(R.id.morningSticker1)?.setOnClickListener {
                    val searchText = "morning"
                    if (searchText.isNotEmpty()) {
                        searchStickers(searchText)
                        Log.d("Touch Working", "")
                    }
                }
                findViewById<TextView>(R.id.lolSticker1)?.setOnClickListener {
                    val searchText = "lol"
                    if (searchText.isNotEmpty()) {
                        searchStickers(searchText)
                        Log.d("Touch Working", "")
                    }
                }
                findViewById<TextView>(R.id.lazySticker1)?.setOnClickListener {
                    val searchText = "lazy"
                    if (searchText.isNotEmpty()) {
                        searchStickers(searchText)
                        Log.d("Touch Working", "")
                    }
                }
                findViewById<TextView>(R.id.stressedSticker1)?.setOnClickListener {
                    val searchText = "stress"
                    if (searchText.isNotEmpty()) {
                        searchStickers(searchText)
                        Log.d("Touch Working", "")
                    }
                }
                findViewById<TextView>(R.id.happySticker1)?.setOnClickListener {
                    val searchText = "happy"
                    if (searchText.isNotEmpty()) {
                        searchStickers(searchText)
                        Log.d("Touch Working", "")
                    }
                }
                findViewById<TextView>(R.id.sadSticker1)?.setOnClickListener {
                    val searchText = "sad"
                    if (searchText.isNotEmpty()) {
                        searchStickers(searchText)
                        Log.d("Touch Working", "")
                    }
                }
                findViewById<TextView>(R.id.wowSticker1)?.setOnClickListener {
                    val searchText = "wow"
                    if (searchText.isNotEmpty()) {
                        searchStickers(searchText)
                        Log.d("Touch Working", "")
                    }
                }
                findViewById<TextView>(R.id.oopsSticker1)?.setOnClickListener {
                    val searchText = "oops"
                    if (searchText.isNotEmpty()) {
                        searchStickers(searchText)
                        Log.d("Touch Working", "")
                    }
                }
                findViewById<TextView>(R.id.welcomeSticker1)?.setOnClickListener {
                    val searchText = "welcome"
                    if (searchText.isNotEmpty()) {
                        searchStickers(searchText)
                        Log.d("Touch Working", "")
                    }
                }
//            }
                val stringUser = sharedPreferences.getString("TO_EDIT_STICKER", "")
                Log.d("LLLLLL", "" + stringUser)
                findViewById<EditText>(R.id.searchStickerEditText1)?.setOnTouchListener { _, event ->
                    when (event.action) {
                        MotionEvent.ACTION_UP -> {
//                        mEmojiPaletteHolder?.findViewById<RelativeLayout>(R.id.emoji_palette_holder)?.beGone()
//                        findViewById<RelativeLayout>(R.id.sticker_palette_holder)?.beGone()
//                        EditSticker()
                        }
                    }
                    false
                }
                findViewById<EditText>(R.id.searchStickerEditText1).setOnClickListener() {
                    val uri = Uri.parse("myapp://wallethome")
                    val pm = context.packageManager
                    // Create an Intent to open the URI
                    val intent = Intent(Intent.ACTION_VIEW, uri)
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)

                    // Check if there's an app that can handle this intent
                    if (intent.resolveActivity(pm) != null) {
                        context.launchActivityIntent(intent)
                    } else {

                    }
                }

                findViewById<ImageButton>(R.id.sticker_palette_backspace).apply {
                    runOnUiThread {
                        applyColorFilter(bottomTextColor)
                        setOnTouchListener { _, event ->
                            when (event.action) {
                                MotionEvent.ACTION_DOWN -> {
                                    isPressed = true
                                    mRepeatKeyIndex =
                                            mKeys.indexOfFirst { it.code == KEYCODE_DELETE }
                                    mCurrentKey = mRepeatKeyIndex
                                    vibrateIfNeeded()
                                    mOnKeyboardActionListener!!.onKey(KEYCODE_DELETE)
                                    // setup repeating backspace
                                    val msg = mHandler!!.obtainMessage(MSG_REPEAT)
                                    mHandler!!.sendMessageDelayed(
                                            msg, REPEAT_START_DELAY.toLong()
                                    )
                                    true
                                }

                                MotionEvent.ACTION_UP -> {
                                    mHandler!!.removeMessages(MSG_REPEAT)
                                    mRepeatKeyIndex = NOT_A_KEY
                                    isPressed = false
                                    false
                                }

                                else -> false
                            }
                        }
                    }
                }
            }
        }
//        setupEmojiSmile()
    }

    private fun setupGIFPalette(toolbarColor: Int, backgroundColor: Int, textColor: Int) {
        mGIFPaletteHolder?.apply {
            runOnUiThread {
//            GIF_palette_top_bar1?.background = ColorDrawable(toolbarColor)
                findViewById<RelativeLayout>(R.id.GIF_palette_holder).background = ColorDrawable(backgroundColor)
                findViewById<ImageButton>(R.id.switch_to_emoji_from_GIF).applyColorFilter(mIconColor)
                findViewById<ImageButton>(R.id.switch_to_sticker_from_GIF).applyColorFilter(mIconColor)
                findViewById<ImageButton>(R.id.switch_to_gif_from_GIF).applyColorFilter(mIconColor)
                findViewById<ImageButton>(R.id.recentGIFsButton1).applyColorFilter(mIconColor)
                findViewById<TextView>(R.id.nervousGIF1).setTextColor(mIconColor)
                findViewById<TextView>(R.id.catGIF1).setTextColor(mIconColor)
                findViewById<TextView>(R.id.morningGIF1).setTextColor(mIconColor)
                findViewById<TextView>(R.id.lolGIF1).setTextColor(mIconColor)
                findViewById<TextView>(R.id.lazyGIF1).setTextColor(mIconColor)
                findViewById<TextView>(R.id.stressedGIF1).setTextColor(mIconColor)
                findViewById<TextView>(R.id.happyGIF1).setTextColor(mIconColor)
                findViewById<TextView>(R.id.sadGIF1).setTextColor(mIconColor)
                findViewById<TextView>(R.id.wowGIF1).setTextColor(mIconColor)
                findViewById<TextView>(R.id.oopsGIF1).setTextColor(mIconColor)
                findViewById<TextView>(R.id.welcomeGIF1).setTextColor(mIconColor)


                findViewById<RelativeLayout>(R.id.GIF_palette_bottom_bar).background = ColorDrawable(backgroundColor)
                val bottomTextColor = textColor.darkenColor()
                findViewById<TextView>(R.id.GIF_palette_mode_change1).apply {
                    runOnUiThread {
                        setTextColor(bottomTextColor)
                        setOnClickListener {
                            vibrateIfNeeded()
                            closeGIFPalette()
                            closeStickerPalette()
                            closeEmojiPalette()

                        }
                    }
                }
                findViewById<TextView>(R.id.switch_to_emoji_from_GIF).setOnClickListener {
                    closeGIFPalette()
                    closeEmojiSuggestionBox()
                    closeStickerPalette()
                    vibrateIfNeeded()
                }
                findViewById<TextView>(R.id.switch_to_sticker_from_GIF).setOnClickListener {
                    closeGIFPalette()
                    openStickerPalette()
                    closeEmojiSuggestionBox()
                    vibrateIfNeeded()
                }

                findViewById<TextView>(R.id.nervousGIF1)?.setOnClickListener {
                    val searchText = "nervous"
                    if (searchText.isNotEmpty()) {
                        searchGIFs(searchText)
//                       val searchResults = getSearchResults(searchText, 8)
//                        Log.d("Touch Working", ""+searchResults)
                    }
                }
                findViewById<TextView>(R.id.catGIF1)?.setOnClickListener {
                    val searchText = "cat"
                    if (searchText.isNotEmpty()) {
                        searchGIFs(searchText)
                        Log.d("Touch Working", "")
                    }
                }
                findViewById<TextView>(R.id.morningGIF1)?.setOnClickListener {
                    val searchText = "morning"
                    if (searchText.isNotEmpty()) {
                        searchGIFs(searchText)
                        Log.d("Touch Working", "")
                    }
                }
                findViewById<TextView>(R.id.lolGIF1)?.setOnClickListener {
                    val searchText = "lol"
                    if (searchText.isNotEmpty()) {
                        searchGIFs(searchText)
                        Log.d("Touch Working", "")
                    }
                }
                findViewById<TextView>(R.id.lazyGIF1)?.setOnClickListener {
                    val searchText = "lazy"
                    if (searchText.isNotEmpty()) {
                        searchGIFs(searchText)
                        Log.d("Touch Working", "")
                    }
                }
                findViewById<TextView>(R.id.stressedGIF1)?.setOnClickListener {
                    val searchText = "stress"
                    if (searchText.isNotEmpty()) {
                        searchGIFs(searchText)
                        Log.d("Touch Working", "")
                    }
                }
                findViewById<TextView>(R.id.happyGIF1)?.setOnClickListener {
                    val searchText = "lol"
                    if (searchText.isNotEmpty()) {
                        searchGIFs(searchText)
                        Log.d("Touch Working", "")
                    }
                }
                findViewById<TextView>(R.id.sadGIF1)?.setOnClickListener {
                    val searchText = "sad"
                    if (searchText.isNotEmpty()) {
                        searchGIFs(searchText)
                        Log.d("Touch Working", "")
                    }
                }
                findViewById<TextView>(R.id.wowGIF1)?.setOnClickListener {
                    val searchText = "wow"
                    if (searchText.isNotEmpty()) {
                        searchGIFs(searchText)
                        Log.d("Touch Working", "")
                    }
                }
                findViewById<TextView>(R.id.oopsGIF1)?.setOnClickListener {
                    val searchText = "oops"
                    if (searchText.isNotEmpty()) {
                        searchGIFs(searchText)
                        Log.d("Touch Working", "")
                    }
                }
                findViewById<TextView>(R.id.welcomeGIF1)?.setOnClickListener {
                    val searchText = "welcome"
                    if (searchText.isNotEmpty()) {
                        searchGIFs(searchText)
                        Log.d("Touch Working", "")
                    }
                }
//            }

                findViewById<ImageButton>(R.id.GIF_palette_backspace).apply {
                    runOnUiThread {
                        applyColorFilter(bottomTextColor)
                        setOnTouchListener { _, event ->
                            when (event.action) {
                                MotionEvent.ACTION_DOWN -> {
                                    isPressed = true
                                    mRepeatKeyIndex =
                                            mKeys.indexOfFirst { it.code == KEYCODE_DELETE }
                                    mCurrentKey = mRepeatKeyIndex
                                    vibrateIfNeeded()
                                    mOnKeyboardActionListener!!.onKey(KEYCODE_DELETE)
                                    // setup repeating backspace
                                    val msg = mHandler!!.obtainMessage(MSG_REPEAT)
                                    mHandler!!.sendMessageDelayed(
                                            msg, REPEAT_START_DELAY.toLong()
                                    )
                                    true
                                }

                                MotionEvent.ACTION_UP -> {
                                    mHandler!!.removeMessages(MSG_REPEAT)
                                    mRepeatKeyIndex = NOT_A_KEY
                                    isPressed = false
                                    false
                                }

                                else -> false
                            }
                        }
                    }
                }
            }
        }
    }

    fun openEmojiPalette(keyboardStatus: String, simpleKeyboardIME: SimpleKeyboardIME) {
        mEmojiPaletteHolder!!.findViewById<RelativeLayout>(R.id.emoji_palette_holder).beVisible()
        if(recentEmojis.size == 0){
            mEmojiPaletteHolder?.findViewById<RelativeLayout>(R.id.emoji_palette_holder)?.findViewById<TextView>(R.id.no_emoji)?.beVisible()
        }else{
            setupRecyclerView()
            mEmojiPaletteHolder?.findViewById<RelativeLayout>(R.id.emoji_palette_holder)?.findViewById<TextView>(R.id.no_emoji)?.beGone()
        }
        setupRecyclerView()
        setupGestureDetection()
    }

    fun openTool() {
        mToolHolder?.findViewById<LinearLayoutCompat>(R.id.tool_holder)?.beVisible()
    }

    fun closeTool() {
        mToolHolder?.findViewById<LinearLayoutCompat>(R.id.tool_holder)?.beGone()
    }

    fun openSuggestionBox() {
        mSuggHolder?.findViewById<LinearLayout>(R.id.sugg_holder)?.beVisible()
    }

    fun extractWordBeforeCursor(text: CharSequence): String {
        // Reverse the text and search for the first space character
        val reversedText = text.reversed()
        val spaceIndex = reversedText.indexOf(' ')

        // If a space is found, extract the word before it
        return if (spaceIndex != -1) {
            reversedText.substring(0, spaceIndex).reversed()
        } else {
            // If no space is found, consider the entire text as the word
            reversedText.toString().reversed()
        }
    }


    fun modifyEditorInfo(inputConnection: InputConnection) {
        val textBeforeCursor = inputConnection.getTextBeforeCursor(10000, 0)
        wordBeforeCursor = textBeforeCursor?.let { extractWordBeforeCursor(it) }!!
        Log.d("TEXTBEFORECURSOR", "" + wordBeforeCursor)
    }

    fun replaceWordBeforeCursor(
            inputConnection: InputConnection,
            wordToReplace: String,
            newWord: String) {
        // Replace the word in the input field
        inputConnection.deleteSurroundingText(wordToReplace.length, 0)
        inputConnection.commitText(newWord, newWord.length)
    }

    fun closeSuggestionBox() {
        mSuggHolder?.findViewById<LinearLayout>(R.id.sugg_holder)?.beGone()
    }

    fun closeEmojiSuggestionBox() {
        mSuggEmojiHolder?.findViewById<LinearLayout>(R.id.sugg_emoji_holder)?.beGone()
    }

    fun openEmojiSuggestionBox() {
        mSuggEmojiHolder?.findViewById<LinearLayout>(R.id.sugg_emoji_holder)?.beVisible()
    }

    fun closeMic() {
        mMicHolder?.findViewById<RelativeLayout>(R.id.microphone_holder)?.beGone()
    }

    fun openStickerPalette() {
        mStickerPaletteHolder?.findViewById<RelativeLayout>(R.id.sticker_palette_holder)?.beVisible()
        setupStickers()
    }

    fun openGIFPalette() {
        mGIFPaletteHolder?.findViewById<RelativeLayout>(R.id.GIF_palette_holder)?.beVisible()
        setupGIFs()
    }

    private fun closeEmojiPalette() {
        mEmojiPaletteHolder?.apply {
            runOnUiThread {
                findViewById<RelativeLayout>(R.id.emoji_palette_holder)?.beGone()
                mEmojiPaletteHolder?.findViewById<MyRecyclerView>(R.id.emojis_list)?.scrollToPosition(0)
            }
        }
    }

    private fun closeGIFPalette() {
        mGIFPaletteHolder?.apply {
            runOnUiThread {
                findViewById<RelativeLayout>(R.id.GIF_palette_holder)?.beGone()
            }
        }
    }

    private fun closeStickerPalette() {
        mStickerPaletteHolder?.apply {
            runOnUiThread {
                findViewById<RelativeLayout>(R.id.sticker_palette_holder)?.beGone()
            }
        }
    }

    private fun setupEmojis(keyboardStatus: String, simpleKeyboardIME: SimpleKeyboardIME) {
        if (this.keyboardStatus.equals("AllEmojis")) {
            Log.e("@#$%", keyboardStatus)
            var fullEmojiList =
                    parseRawEmojiSpecsFile(simpleKeyboardIME, EMOJI_SPEC_FILE_PATH_SMILE)
            val systemFontPaint = Paint().apply {
                typeface = Typeface.DEFAULT
            }
            val emojis = fullEmojiList.filter { emoji ->
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    systemFontPaint.hasGlyph(emoji) || (EmojiCompat.get().loadState == EmojiCompat.LOAD_STATE_SUCCEEDED && EmojiCompat.get()
                            .getEmojiMatch(emoji, emojiCompatMetadataVersion) == EMOJI_SUPPORTED)
                } else {
                    TODO("VERSION.SDK_INT < M")
                }
            }

            Log.e("\\\\", "Ish" + emojis)
            setupEmojiAdapter(emojis)


        } else if (this.keyboardStatus.equals("Recent")) {
            Log.e("@#$%%", keyboardStatus)

            setupEmojiAdapter(recentEmojis)
            Log.d("Recent:", "" + recentEmojis)


        } else if (this.keyboardStatus.equals("personEmoji")) {
            Log.e("@#$%%", keyboardStatus)
            var fullEmojiList1 =
                    parseRawEmojiSpecsFile2(simpleKeyboardIME, EMOJI_SPEC_FILE_PATH_HELLO)
            Log.e("+++/", "Ishh" + fullEmojiList1)
            val systemFontPaint = Paint().apply {
                typeface = Typeface.DEFAULT
            }
            val emojiss = fullEmojiList1.filter { emoji ->
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    systemFontPaint.hasGlyph(emoji) || (EmojiCompat.get().loadState == EmojiCompat.LOAD_STATE_SUCCEEDED && EmojiCompat.get()
                            .getEmojiMatch(emoji, emojiCompatMetadataVersion) == EMOJI_SUPPORTED)
                } else {
                    TODO("VERSION.SDK_INT < M")
                }
            }

            Log.e("////", "Ishh" + emojiss)
            setupEmojiAdapter(emojiss)


        } else if (this.keyboardStatus.equals("BulbEmoji")) {
            Log.e("@#$%%", keyboardStatus)
            var fullEmojiList2 =
                    parseRawEmojiSpecsFile3(simpleKeyboardIME, EMOJI_SPEC_FILE_PATH_BULB)
            Log.e("+++/", "Ishh" + fullEmojiList2)
            val systemFontPaint = Paint().apply {
                typeface = Typeface.DEFAULT
            }
            val emojisss = fullEmojiList2.filter { emoji ->
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    systemFontPaint.hasGlyph(emoji) || (EmojiCompat.get().loadState == EmojiCompat.LOAD_STATE_SUCCEEDED && EmojiCompat.get()
                            .getEmojiMatch(emoji, emojiCompatMetadataVersion) == EMOJI_SUPPORTED)
                } else {
                    TODO("VERSION.SDK_INT < M")
                }
            }

            Log.e("////", "Ishh" + emojisss)
            setupEmojiAdapter(emojisss)


        } else if (this.keyboardStatus.equals("cityEmoji")) {
            Log.e("@#$%%", keyboardStatus)
            var fullEmojiListCity =
                    parseRawEmojiSpecsFile4(simpleKeyboardIME, EMOJI_SPEC_FILE_PATH_CITY)
            Log.e("+++/", "Ishh" + fullEmojiListCity)
            val systemFontPaint = Paint().apply {
                typeface = Typeface.DEFAULT
            }
            val emojiscity = fullEmojiListCity.filter { emoji ->
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    systemFontPaint.hasGlyph(emoji) || (EmojiCompat.get().loadState == EmojiCompat.LOAD_STATE_SUCCEEDED && EmojiCompat.get()
                            .getEmojiMatch(emoji, emojiCompatMetadataVersion) == EMOJI_SUPPORTED)
                } else {
                    TODO("VERSION.SDK_INT < M")
                }
            }


            setupEmojiAdapter(emojiscity)


        } else if (this.keyboardStatus.equals("FlagEmoji")) {
            Log.e("@#$%%", keyboardStatus)
            val fullEmojiListFlag =
                    parseRawEmojiSpecsFile5(simpleKeyboardIME, EMOJI_SPEC_FILE_PATH_FLAG)
            Log.e("+++/", "Ishh" + fullEmojiListFlag)
            val systemFontPaint = Paint().apply {
                typeface = Typeface.DEFAULT
            }
            val emojisflag = fullEmojiListFlag.filter { emoji ->
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    systemFontPaint.hasGlyph(emoji) || (EmojiCompat.get().loadState == EmojiCompat.LOAD_STATE_SUCCEEDED && EmojiCompat.get()
                            .getEmojiMatch(emoji, emojiCompatMetadataVersion) == EMOJI_SUPPORTED)
                } else {
                    TODO("VERSION.SDK_INT < M")
                }
            }

            setupEmojiAdapter(emojisflag)


        } else if (this.keyboardStatus.equals("WinnerEmoji")) {
            Log.e("@#$%%", keyboardStatus)
            val fullEmojiListWinner =
                    parseRawEmojiSpecsFile6(simpleKeyboardIME, EMOJI_SPEC_FILE_PATH_WINNER)
            Log.e("+++/", "Ishh" + fullEmojiListWinner)
            val systemFontPaint = Paint().apply {
                typeface = Typeface.DEFAULT
            }
            val emojiswinner = fullEmojiListWinner.filter { emoji ->
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    systemFontPaint.hasGlyph(emoji) || (EmojiCompat.get().loadState == EmojiCompat.LOAD_STATE_SUCCEEDED && EmojiCompat.get()
                            .getEmojiMatch(emoji, emojiCompatMetadataVersion) == EMOJI_SUPPORTED)
                } else {
                    TODO("VERSION.SDK_INT < M")
                }
            }
            setupEmojiAdapter(emojiswinner)


        } else if (this.keyboardStatus.equals("CoffeeEmoji")) {
            Log.e("@#$%%", keyboardStatus)
            val fullEmojiListCoffee =
                    parseRawEmojiSpecsFile7(simpleKeyboardIME, EMOJI_SPEC_FILE_PATH_COFFEE)
            Log.e("+++/", "Ishh" + fullEmojiListCoffee)
            val systemFontPaint = Paint().apply {
                typeface = Typeface.DEFAULT
            }
            val emojiscoffee = fullEmojiListCoffee.filter { emoji ->
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    systemFontPaint.hasGlyph(emoji) || (EmojiCompat.get().loadState == EmojiCompat.LOAD_STATE_SUCCEEDED && EmojiCompat.get()
                            .getEmojiMatch(emoji, emojiCompatMetadataVersion) == EMOJI_SUPPORTED)
                } else {
                    TODO("VERSION.SDK_INT < M")
                }
            }
            setupEmojiAdapter(emojiscoffee)


        } else if (this.keyboardStatus.equals("SymbolsEmoji")) {
            Log.e("@#$%%", keyboardStatus)
            val fullEmojiListSymbols =
                    parseRawEmojiSpecsFile8(simpleKeyboardIME, EMOJI_SPEC_FILE_PATH_SYMBOL)
            Log.e("+++/", "Ishh" + fullEmojiListSymbols)
            val systemFontPaint = Paint().apply {
                typeface = Typeface.DEFAULT
            }
            val emojissymbols = fullEmojiListSymbols.filter { emoji ->
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    systemFontPaint.hasGlyph(emoji) || (EmojiCompat.get().loadState == EmojiCompat.LOAD_STATE_SUCCEEDED && EmojiCompat.get()
                            .getEmojiMatch(emoji, emojiCompatMetadataVersion) == EMOJI_SUPPORTED)
                } else {
                    TODO("VERSION.SDK_INT < M")
                }
            }
            setupEmojiAdapter(emojissymbols)


        } else if (this.keyboardStatus.equals("ArrowEmoji")) {
            Log.e("@#$%%", keyboardStatus)
            var fullEmojiListArrow =
                    parseRawEmojiSpecsFile9(simpleKeyboardIME, EMOJI_SPEC_FILE_PATH_ARROW)
            val systemFontPaint = Paint().apply {
                typeface = Typeface.DEFAULT
            }
            val emojisarrow = fullEmojiListArrow.filter { emoji ->
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    systemFontPaint.hasGlyph(emoji) || (EmojiCompat.get().loadState == EmojiCompat.LOAD_STATE_SUCCEEDED && EmojiCompat.get()
                            .getEmojiMatch(emoji, emojiCompatMetadataVersion) == EMOJI_SUPPORTED)
                } else {
                    TODO("VERSION.SDK_INT < M")
                }
            }
            setupEmojiAdapter(emojisarrow)


        }
    }

    private fun addToRecentEmojis(emoji: String) {
        if (recentEmojis.contains(emoji)) {
            recentEmojis.remove(emoji)
        }
        recentEmojis.add(0, emoji)

        if (recentEmojis.size > 5) {
            recentEmojis.removeAt(recentEmojis.size - 1)
        }

    }

    private fun setupStickers() {
        setupStickerAdapter()
    }

    private fun setupGIFs() {
        setupGIFAdapter()
    }

    private fun setupStickerAdapter() {
        mStickerPaletteHolder?.findViewById<MyRecyclerView>(R.id.sticker_list)?.apply {
            runOnUiThread {
                val stickerItemWidth =
                        context.resources.getDimensionPixelSize(R.dimen.sticker_item_size)
                val StickerTopBarElevation =
                        context.resources.getDimensionPixelSize(R.dimen.emoji_top_bar_elevation)
                                .toFloat()

//            layoutManager = AutoGridLayoutManager(context, stickerItemWidth)
//            adapter = StickerAdapter(stickers)

                adapter = StickerAdapter(context, stickers)
                layoutManager = AutoGridLayoutManager(context, stickerItemWidth)

                onScroll {
                    mStickerPaletteHolder!!.findViewById<LinearLayout>(R.id.sticker_palette_top_bar1).elevation =
                            if (it > 4) StickerTopBarElevation else 0f
                }
            }
        }
    }

    private fun setupGIFAdapter() {
        mGIFPaletteHolder?.findViewById<MyRecyclerView>(R.id.GIF_list)?.apply {
            runOnUiThread {
                val GIFItemWidth = context.resources.getDimensionPixelSize(R.dimen.gif_item_size)
                val GIFTopBarElevation =
                        context.resources.getDimensionPixelSize(R.dimen.emoji_top_bar_elevation)
                                .toFloat()

                try {
                    adapter = GIFAdapter(context, gifs) { gif ->
                        mOnKeyboardActionListener!!.commitGifImage(gif, "")
                    }
                } catch (e:Exception ) {
                    // Handle the exception, log it, or perform some error recovery
                    e.printStackTrace();
                }


                layoutManager = AutoGridLayoutManager(context, GIFItemWidth)
                onScroll {
                    mGIFPaletteHolder!!.findViewById<LinearLayout>(R.id.GIF_palette_top_bar1).elevation =
                            if (it > 4) GIFTopBarElevation else 0f
                }
            }
        }
    }

    private fun setupEmojiAdapter(emojis: List<String>) {
        mEmojiPaletteHolder?.findViewById<MyRecyclerView>(R.id.emojis_list)?.apply {
            runOnUiThread {
                val emojiItemWidth =
                        context.resources.getDimensionPixelSize(R.dimen.emoji_item_size)
                val emojiTopBarElevation =
                        context.resources.getDimensionPixelSize(R.dimen.emoji_top_bar_elevation)
                                .toFloat()

                layoutManager = AutoGridLayoutManager(context, emojiItemWidth)
                adapter = EmojisAdapter(context = context, items = emojis) { emoji ->
                    mOnKeyboardActionListener!!.onText(emoji)
                    vibrateIfNeeded()
                    addRecentEmoji(emoji)
                    Log.d("Added Emoji", "" + emoji)
                    updateTopBarElevation()
                }

                onScroll { dy ->
                    updateTopBarElevation(dy)
                }
            }
        }
    }

    fun printRecentlyUsedEmojis() {
        for (emoji in recentlyUsedEmojis) {
            println(emoji)
        }
    }


    private fun updateTopBarElevation(scrollDistance: Int = 0) {
        val emojiTopBarElevation =
                context.resources.getDimensionPixelSize(R.dimen.emoji_top_bar_elevation).toFloat()
        val maxRecentEmojis = 4
        val emojiCount = recentlyUsedEmojis.size

        mEmojiPaletteHolder?.findViewById<LinearLayout>(R.id.emoji_palette_top_bar)?.elevation =
                if (scrollDistance > maxRecentEmojis && emojiCount > 0) emojiTopBarElevation else 0f
    }

    private fun addRecentEmoji(emoji: String) {
        if (recentEmojis.contains(emoji)) {
            recentEmojis.remove(emoji)
        }
        recentEmojis.add(0, emoji)
        Log.d("List", "" + emoji)
        Log.d("Listr", "" + recentEmojis)

        if (recentEmojis.size > 25) {
            recentEmojis.removeAt(recentEmojis.size - 1)
        }
    }


    private fun displayEmoji(emoji: String) {
        Log.d("Recently Used Emojis:", "" + emoji)
    }


    private fun closing() {
        if (mPreviewPopup.isShowing) {
            mPreviewPopup.dismiss()
        }
        removeMessages()
        dismissPopupKeyboard()
        mBuffer = null
        mCanvas = null
        mMiniKeyboardCache.clear()
    }

    private fun removeMessages() {
        mHandler?.apply {
            runOnUiThread {
                removeMessages(MSG_REPEAT)
                removeMessages(MSG_LONGPRESS)
            }
        }
    }

    public override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        closing()
        stopSpeechRecognition()
    }

    private fun stopSpeechRecognition() {
        speechRecognizer?.stopListening()
    }

    private fun dismissPopupKeyboard() {
        if (mPopupKeyboard.isShowing) {
            mPopupKeyboard.dismiss()
            mMiniKeyboardOnScreen = false
            invalidateAllKeys()
        }
    }


    private fun displayWordSuggestions(suggestions: List<String>) {

    }


}
