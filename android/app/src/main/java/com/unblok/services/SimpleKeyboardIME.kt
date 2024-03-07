package com.unblok.services


import android.content.ClipDescription
import android.content.Context
import android.content.SharedPreferences
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.content.res.Resources
import android.inputmethodservice.InputMethodService
import android.net.Uri
import android.os.Build
import android.os.SystemClock
import android.provider.Settings
import android.speech.SpeechRecognizer
import android.text.InputType
import android.text.InputType.TYPE_CLASS_DATETIME
import android.text.InputType.TYPE_CLASS_NUMBER
import android.text.InputType.TYPE_CLASS_PHONE
import android.text.InputType.TYPE_MASK_CLASS
import android.util.Log
import android.view.KeyEvent
import android.view.View
import android.view.inputmethod.EditorInfo
import android.view.inputmethod.EditorInfo.IME_ACTION_NONE
import android.view.inputmethod.EditorInfo.IME_FLAG_NO_ENTER_ACTION
import android.view.inputmethod.EditorInfo.IME_MASK_ACTION
import android.view.inputmethod.ExtractedTextRequest
import android.view.inputmethod.InputConnection
import android.widget.EditText
import androidx.annotation.RequiresApi
import androidx.appcompat.widget.AppCompatTextView
import androidx.core.view.inputmethod.EditorInfoCompat
import androidx.core.view.inputmethod.InputConnectionCompat
import androidx.core.view.inputmethod.InputContentInfoCompat
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.simplemobiletools.commons.extensions.getSharedPrefs
import com.simplemobiletools.keyboard.extensions.config
import com.simplemobiletools.keyboard.helpers.LANGUAGE_BENGALI
import com.simplemobiletools.keyboard.helpers.LANGUAGE_BULGARIAN
import com.simplemobiletools.keyboard.helpers.LANGUAGE_ENGLISH_DVORAK
import com.simplemobiletools.keyboard.helpers.LANGUAGE_ENGLISH_QWERTZ
import com.simplemobiletools.keyboard.helpers.LANGUAGE_FRENCH
import com.simplemobiletools.keyboard.helpers.LANGUAGE_GERMAN
import com.simplemobiletools.keyboard.helpers.LANGUAGE_GREEK
import com.simplemobiletools.keyboard.helpers.LANGUAGE_LITHUANIAN
import com.simplemobiletools.keyboard.helpers.LANGUAGE_ROMANIAN
import com.simplemobiletools.keyboard.helpers.LANGUAGE_RUSSIAN
import com.simplemobiletools.keyboard.helpers.LANGUAGE_SLOVENIAN
import com.simplemobiletools.keyboard.helpers.LANGUAGE_SPANISH
import com.simplemobiletools.keyboard.helpers.LANGUAGE_TURKISH_Q
import com.simplemobiletools.keyboard.helpers.MyKeyboard
import com.simplemobiletools.keyboard.helpers.ShiftState
import com.simplemobiletools.keyboard.views.MyKeyboardView
import com.unblok.ApiClient.APiClient
import com.unblok.DataModal.DataModal
import com.unblok.DataModal.RequestModal
import com.unblok.DataModal.WalletDataModal
import com.unblok.EmojiItem
import com.unblock.R
import com.unblok.WalletAddressRetrofit
import com.unblok.WordSuggestion
import com.unblok.views.CustomRelativeLayout
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import okhttp3.Callback
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import okio.IOException
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.nio.charset.Charset
import java.util.Locale


class SimpleKeyboardIME : InputMethodService(), MyKeyboardView.OnKeyboardActionListener, MyKeyboardView.InputConnectionListener,
        SharedPreferences.OnSharedPreferenceChangeListener {
    private var SHIFT_PERM_TOGGLE_SPEED =
            500   // how quickly do we have to doubletap shift to enable permanent caps lock
    private val KEYBOARD_LETTERS = 0
    private val KEYBOARD_SYMBOLS = 1
    private val KEYBOARD_SYMBOLS_SHIFT = 2
    private val KEYBOARD_NUMBERS = 3
    private val KEYBOARD_PHONE = 4
    private var concat_word: String = ""
    private val wordsList: MutableList<String> = mutableListOf()
    private var instance: APiClient? = null
    private lateinit var sharedPreferences: SharedPreferences
    var list = ArrayList<String>()
    private val API_URL = "http://192.53.121.26:8096/v1/user/getUserBymail/"
    private var keyboard: MyKeyboard? = null
    private var keyboardView: MyKeyboardView? = null
    private var lastShiftPressTS = 0L
    private var keyboardMode = KEYBOARD_LETTERS
    private var inputTypeClass = InputType.TYPE_CLASS_TEXT
    private var enterKeyType = IME_ACTION_NONE
    private var switchToLetters = false
    private var speechRecognizer: SpeechRecognizer? = null
    private val client = OkHttpClient()
    private val gson = Gson()
    private var editText: EditText? = null
    private var emojiList: List<EmojiItem> = emptyList()
    private var onClick: Boolean = false
    private var EditTextWord: String = " "
    private var customRelativeLayout: CustomRelativeLayout? = null
    var context: Context = this
    private var isCapitalizedd: Boolean = false

    // API call for keyword
    private fun makeApiCall() {
        val retrofit = Retrofit.Builder()
                .baseUrl(API_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
        val apiService = retrofit.create(WalletAddressRetrofit::class.java)
        val context: Context = this
        val sharedPreferences = context.getSharedPreferences("your_shared_prefs_name", Context.MODE_PRIVATE)
        val mail = sharedPreferences.getString("MAILADDRESS", "")
        Log.d("MAILADRESS", mail.toString())
        val call = apiService.getUserByMail(mail.toString())

        call.enqueue(object : retrofit2.Callback<WalletDataModal> {
            override fun onResponse(
                    call: retrofit2.Call<WalletDataModal>,
                    response: retrofit2.Response<WalletDataModal>
            ) {
                if (response.isSuccessful) {
                    val userDetails = response.body()?.data?.userDetails?.primaryWallet
                    if (userDetails != null) {
                        Log.d("????", "" + userDetails)
                        val editor = sharedPreferences.edit()
                        editor.putString("Wallet_Address", userDetails)
                        editor.apply()
                    }
                } else {
                    // Handle unsuccessful response
                }
            }

            override fun onFailure(call: retrofit2.Call<WalletDataModal>, t: Throwable) {
                t.printStackTrace()
                // Handle network failure
            }
        })
    }

    private fun onWordSuggestions(word: String, isCapitalized: Boolean, callback: (List<WordSuggestion>?) -> Unit): String {
        var check = ""
        Log.d("Woord", "" + word)
        Log.d("isCapitalized:", "" + isCapitalized)
        var url = "https://api.datamuse.com/words?sp=$word%2A&max=10"
        if (word.isEmpty()) {
            url = "https://api.datamuse.com/words?sp=$word&max=10"
        }
        Log.d("Function Enter as value:", url)
        val request = Request.Builder()
                .url(url)
                .build()
        Log.d("Check:", "" + check)
        Log.d("Function Enter:", "" + request)
        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: okhttp3.Call, e: IOException) {
                Log.d("Failure:", "" + e)
                callback(null) // Invoke the callback with null to indicate failure
            }

            override fun onResponse(call: okhttp3.Call, response: Response) {
                try {
                    Log.d("******", "" + response)
                    if (response.isSuccessful) {
                        val responseBody = response.body?.string()
                        Log.d("IIII", "" + responseBody)
                        if (responseBody != null) {
                            Log.d("IIII", "" + responseBody)
                            val suggestions = gson.fromJson<List<WordSuggestion>>(
                                    responseBody,
                                    object : TypeToken<List<WordSuggestion>>() {}.type
                            )
                            Log.d("III", "" + suggestions)
                            check = suggestions.toString()
                            Log.d("IsCapitalized", "" + isCapitalized)
                            Log.d("Word:", "" + word)
                            // Capitalize suggestions if the input word is capitalized
                            if (word.isNotEmpty() && word[0].isUpperCase()) {
                                suggestions.forEach { suggestion ->
                                    suggestion.word = suggestion.word.replaceFirstChar {
                                        if (it.isLowerCase()) it.titlecase(Locale.getDefault()) else it.toString()
                                    }
                                }
                            }
                            val editor = sharedPreferences.edit()
                            editor.putString("pressed_letter", responseBody)
                            editor.apply()
                            Log.d("III", "" + suggestions.toString())

                            callback(suggestions) // Invoke the callback with the suggestions
                        } else {
                            callback(null) // Invoke the callback with null to indicate failure
                        }
                    } else {
                        callback(null) // Invoke the callback with null to indicate failure
                    }
                } catch (e: IOException) {
                    callback(null) // Invoke the callback with null to indicate failure
                }
            }
        })
        return word
    }


    // Api call for Next word Suggestions
    fun onNextWordSuggestions(
            previous_word: String,
            callback: (List<WordSuggestion>?) -> Unit
    ): String {
        var check = ""
        var url = "https://api.datamuse.com/words?lc=$previous_word&sp=*&max=3"
        Log.d("NFunction Enter as value:", url)
        val request = Request.Builder()
                .url(url)
                .build()
        Log.d("NCheck:", "" + check)
        Log.d("NFunction Enter:", "" + request)
        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: okhttp3.Call, e: IOException) {
                Log.d("NFailure:", "" + e)
                callback(null) // Invoke the callback with null to indicate failure
            }

            override fun onResponse(call: okhttp3.Call, response: Response) {
                try {
                    Log.d("******", "" + response)
                    if (response.isSuccessful) {
                        val responseBody = response.body?.string()
                        Log.d("NIIII", "" + responseBody)
                        if (responseBody != null) {
                            Log.d("NIIII", "" + responseBody)
                            val suggestions = gson.fromJson<List<WordSuggestion>>(
                                    responseBody,
                                    object : TypeToken<List<WordSuggestion>>() {}.type
                            )
                            Log.d("NIII", "" + suggestions)
                            check = suggestions.toString()
                            val editor = sharedPreferences.edit()
                            editor.putString("Npressed_letter", responseBody)
                            editor.apply()
                            Log.d("NIII", "" + suggestions.toString())

                            callback(suggestions) // Invoke the callback with the suggestions
                        } else {
                            callback(null) // Invoke the callback with null to indicate failure
                        }
                    } else {
                        callback(null) // Invoke the callback with null to indicate failure
                    }
                } catch (e: IOException) {
                    callback(null) // Invoke the callback with null to indicate failure
                }
            }
        })
        return previous_word
    }

    override fun onInitializeInterface() {
        super.onInitializeInterface()
        getSharedPrefs().registerOnSharedPreferenceChangeListener(this)
    }

    override fun onInputConnectionReceived(inputConnection: InputConnection) {
        // Here, you have access to the InputConnection, and you can use it as needed.
        // Store it in a member variable or perform text input operations.
    }

    // Keyboard Creation
    override fun onCreateInputView(): View {
        val keyboardHolder = layoutInflater.inflate(R.layout.keyboard_view_keyboard, null)
        editText = keyboardHolder.findViewById(R.id.searchStickerEditText)
        keyboardView = keyboardHolder.findViewById<MyKeyboardView>(R.id.keyboard_view) as MyKeyboardView
        keyboardView!!.setKeyboard(keyboard!!)
        sharedPreferences = getSharedPreferences("MyPrefs", MODE_PRIVATE)
        keyboardView!!.setKeyboardHolder(keyboardHolder.findViewById<MyKeyboardView>(R.id.keyboard_holder))
        keyboardView!!.setEditorInfo(currentInputEditorInfo)
        keyboardView!!.mOnKeyboardActionListener = this
        return keyboardHolder!!
        setCandidatesViewShown(true)

    }
//    private fun showCustomDialog() {
//        customDialog.show()
//    }

    // onPress Event for keys
    override fun onPress(primaryCode: Int) {
        if (primaryCode != 0) {
            keyboardView?.vibrateIfNeeded()
        }


    }

    override fun onStartInputView(info: EditorInfo?, restarting: Boolean) {
        val mimeTypes = info?.let { EditorInfoCompat.getContentMimeTypes(it) }
        var gifSupported = false
        if (mimeTypes != null) {
            for (mimeType in mimeTypes) {
                if (ClipDescription.compareMimeTypes(mimeType, "image/gif")) {
                    gifSupported = true
                }
            }
        }
        if (gifSupported) {
            Log.d("GIF Support","")
            // the target editor supports GIFs. enable corresponding content
        } else {
            Log.d("GIF not Support","")
            // the target editor does not support GIFs. disable corresponding content
        }
    }
    // onStartInput Event for keys
    override fun onStartInput(attribute: EditorInfo?, restarting: Boolean) {
        super.onStartInput(attribute, restarting)
        inputTypeClass = attribute!!.inputType and TYPE_MASK_CLASS
        enterKeyType = attribute.imeOptions and (IME_MASK_ACTION or IME_FLAG_NO_ENTER_ACTION)
        keyboard = createNewKeyboard()
        keyboardView?.setKeyboard(keyboard!!)
        keyboardView?.setEditorInfo(attribute)
        updateShiftKeyState()
        val empty_suggestions = listOf(
                WordSuggestion("I"),
                WordSuggestion("Power"),
                WordSuggestion("You")
        )
        keyboardView?.handleSuggestions(empty_suggestions, currentInputConnection)
    }


    override fun ClearConnection() {

    }

    //Shift Keyboard
    private fun updateShiftKeyState() {
        if (keyboardMode == KEYBOARD_LETTERS) {
            val editorInfo = currentInputEditorInfo
            if (editorInfo != null && editorInfo.inputType != InputType.TYPE_NULL && keyboard?.mShiftState != ShiftState.ON_PERMANENT) {
                keyboard?.setShifted(ShiftState.OFF)
                keyboardView?.invalidateAllKeys()
            }
        }
    }

    // Api call for sending the API
    fun sendToApi(deviceId: String, applicationName: String) {
        val context: Context = this
        val sharedPreferences =
                context.getSharedPreferences("your_shared_prefs_name", Context.MODE_PRIVATE)
        val mail = sharedPreferences.getString("MAILADDRESS", "")
        Log.d("MAILADRESS", mail.toString())
        Log.d("DeviceID", deviceId)
        Log.d("Application Name", applicationName)
        val wallet_primary_address = sharedPreferences.getString("Wallet_Address", "")
        Log.d("Wallet_Address", "" + wallet_primary_address)
        instance = APiClient.getInstance()
        val requestModal = RequestModal()
        requestModal.appname = applicationName
        requestModal.deviceid = deviceId
        requestModal.keyword = wordsList
        requestModal.walletAddress = wallet_primary_address
        requestModal.mailAddress = mail.toString()

        with(instance) {
            this?.apiInterface?.sendKeyboardRecord(requestModal)
                    ?.enqueue(object : retrofit2.Callback<DataModal?> {
                        override fun onResponse(
                                call: retrofit2.Call<DataModal?>,
                                response: retrofit2.Response<DataModal?>
                        ) {
                            Log.i("TestResponse : ", "" + response.toString())
                        }

                        override fun onFailure(call: retrofit2.Call<DataModal?>, t: Throwable) {
                            Log.i("TestResponseError : ", "" + t)
                        }
                    })
        }
    }

    //Function to Get Device Id
    fun getDeviceId(context: Context): String {
        return Settings.Secure.getString(context.contentResolver, Settings.Secure.ANDROID_ID)
    }

    // Function to fetch application name
    fun getApplicationName(context: Context, applicationName: String): String {
        val pm: PackageManager = applicationContext.packageManager
        var ai: ApplicationInfo?
        try {
            ai = pm.getApplicationInfo(currentInputEditorInfo.packageName, 0)
        } catch (e: PackageManager.NameNotFoundException) {
            ai = null
        }
        var applicationName = ai?.let { pm.getApplicationLabel(it).toString() } ?: "(unknown)"
        return applicationName
    }

    // send Device Id and App name
    fun fetchDeviceIdAndAppName(context: Context) {
        val deviceId = getDeviceId(context)
        val applicationName = getApplicationName(context, context.packageName)
        Log.d("Device Id", deviceId)
        Log.d("Application name", applicationName)
        GlobalScope.launch(Dispatchers.IO) {
            sendToApi(deviceId, applicationName)
            wordsList.clear()
            makeApiCall()
        }

    }

    // Handling Backspace for fetching letters simultaneously for suggestions purpose
    private fun handleBackspace() {
        if (concat_word.isNotEmpty()) {
            val lastWordIndex = concat_word.lastIndexOf(' ')
            if (lastWordIndex != -1) {
                concat_word = concat_word.substring(0, lastWordIndex)
            } else {
                concat_word = concat_word.dropLast(1)
            }
        }
    }

    // Long Press for Backspace
    override fun onKeyLongPress(keyCode: Int, event: KeyEvent?): Boolean {
        if (keyCode == MyKeyboard.KEYCODE_DELETE) {
            // Handle the long-press of the backspace key here

            // Get the current input connection
            val inputConnection = currentInputConnection

            if (inputConnection != null) {
                // Perform the action you want, for example, deleting a word
                val textBeforeCursor = inputConnection.getTextBeforeCursor(100, 0)
                val spaceIndex = textBeforeCursor?.lastIndexOf(' ')

                if (spaceIndex != null) {
                    if (spaceIndex >= 0) {
                        inputConnection.deleteSurroundingText(textBeforeCursor.length - spaceIndex, 0)
                    } else {
                        // If no space is found, delete a character
                        inputConnection.deleteSurroundingText(1, 0)
                    }
                }

                return true // The event has been handled
            }
        }
        return super.onKeyLongPress(keyCode, event)
    }


//    private fun getCountToDelete(inputConnection: InputConnection): Int {
//        if (breakIterator == null || !isNougatPlus()) {
//            return 1
//        }
//        val prevText = inputConnection.getTextBeforeCursor(8, 0)
//        if (!TextUtils.isEmpty(prevText)) {
//            return breakIterator?.let {
//                it.setText(prevText.toString())
//                val end = it.last()
//                val start = it.previous()
//                (end - (if (start == BreakIterator.DONE) 0 else start)).coerceIn(
//                        0,
//                        prevText?.length
//                )
//            } ?: 1
//        }
//        return 1
//    }

    override fun onCreate() {
        super.onCreate()

        // Call parseJsonData() here or at another appropriate point in your code
        parseJsonData()
    }

    private fun parseJsonData() {
        try {
            // Load JSON data from assets
            val inputStream = assets.open("emoji.json")
            val size = inputStream.available()
            val buffer = ByteArray(size)
            inputStream.read(buffer)
            inputStream.close()
            val jsonString = String(buffer, Charset.defaultCharset())

            // Parse JSON data into a list of EmojiItem objects
            val jsonArray = JSONArray(jsonString)
            emojiList = parseJsonArray(jsonArray)
        } catch (e: IOException) {
            // Handle the case where the JSON file couldn't be loaded or parsed
            e.printStackTrace()
            emojiList = emptyList()
        } catch (e: JSONException) {
            // Handle JSON parsing errors
            e.printStackTrace()
            emojiList = emptyList()
        }
    }

    // onKey Event
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

    //    override fun commitGifImage(contentUri: Uri, imageDescription: String) {
//        val inputContentInfo = InputContentInfoCompat(
//                contentUri,
//                ClipDescription(imageDescription, arrayOf("image/gif")),
//                null
//        )
//        val inputConnection = currentInputConnection
//        val editorInfo = currentInputEditorInfo
//        var flags = 0
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N_MR1) {
//            flags = flags or InputConnectionCompat.INPUT_CONTENT_GRANT_READ_URI_PERMISSION
//        }
//
//    InputConnectionCompat.commitContent(inputConnection, editorInfo, inputContentInfo, flags, null)
//    }
    override fun commitGifImage(contentUri: Uri, imageDescription: String) {
        try {
            val inputContentInfo = InputContentInfoCompat(
                    contentUri,
                    ClipDescription(imageDescription, arrayOf("image/gif")),
                    null
            )
            val inputConnection = currentInputConnection
            val editorInfo = currentInputEditorInfo
            var flags = 0
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N_MR1) {
                flags = flags or InputConnectionCompat.INPUT_CONTENT_GRANT_READ_URI_PERMISSION
            }
            InputConnectionCompat.commitContent(inputConnection, editorInfo, inputContentInfo, flags, null)
        } catch (e: Exception) {
            // Handle the exception here, you can log it or take appropriate action
            e.printStackTrace()
        }
    }


    private var currentWord: StringBuilder = StringBuilder()
    override fun onKey(primaryCode: Int) {
        keyboardView?.openSuggestionBox()
        keyboardView?.closeMic()
        Log.d("____:", "" + primaryCode)
        val char = primaryCode.toChar()
        val charAsString = char.toString()
        currentWord.append(charAsString)
        val event = KeyEvent(
                SystemClock.uptimeMillis(),
                KeyEvent.ACTION_DOWN.toLong(), KeyEvent.ACTION_UP, primaryCode, 0
        )
        if (!onClick) {
            editText?.dispatchKeyEvent(event)
        }
        //Handling Send Button for Suggestions
        if (primaryCode == -4) {
            val sentence = currentWord.toString()
            Log.d("Current_word: ", "" + currentWord)
            Log.d("Sentence: ", "" + sentence)
            val words = sentence.split(" ")
            Log.d("words: ", "" + words)
            wordsList.addAll(words)
            currentWord = StringBuilder()
        }

        // Handling space button for suggestions
        var inputConnection: InputConnection? = currentInputConnection
        if (inputConnection != null) {
            Log.d("I'm not null", "")
            try {
                keyboardView?.modifyEditorInfo(inputConnection)
                //inputConnection.getTextBeforeCursor(1000,0)
                // currentInputConnection.getTextBeforeCursor(1000,0)
            } catch (e: Exception) {
                Log.d("data :", "" + e)
            }

        }
        if (primaryCode == 32) {
            Log.d("Suggestions", "" + concat_word)
            onNextWordSuggestions(concat_word) { suggestions ->
                if (suggestions != null) {
                    keyboardView?.handleSuggestions(suggestions, currentInputConnection)
                    Log.d("Print !", "" + suggestions)
                } else {
                    Log.d("NextWord", "Wrong")
                }
            }
            if (keyboardMode == KEYBOARD_LETTERS) {
                val editorInfo = currentInputEditorInfo
                if (editorInfo != null && editorInfo.inputType != InputType.TYPE_NULL && keyboard?.mShiftState != ShiftState.ON_PERMANENT) {
                    keyboard?.setShifted(ShiftState.OFF)
                    keyboardView?.invalidateAllKeys()
                }
            }
        }

        var letter = primaryCode.toChar().toString()
        Log.d("Letter:", "" + letter)
        val regex = Regex("[A-Za-z]")
        val onlyletter = regex.findAll(letter).joinToString("") { it.value }
        EditTextWord += onlyletter
        Log.d("EditTextWord", "")
        val editor_edittext = sharedPreferences.edit()
        editor_edittext.putString("EDITTEXT", EditTextWord)
        editor_edittext.apply()
        Log.d("Character", "" + char)
        Log.d("Revert word in :", "" + letter)
        if (char == ' ') {
            Log.d("Revert word space :", "" + letter)
            concat_word = ""
        } else if (primaryCode == -5) {
            handleBackspace()
            Log.d("Revert word handlespace :", "" + letter)
        } else {
            concat_word += letter
            Log.d("Revert word out before :", "" + concat_word)
        }
        Log.d("Revert:", "" + concat_word)
        if (concat_word.isNotEmpty() && concat_word[0] == '￿') {
            concat_word = concat_word.filter { it.isLetter() }
        } else {
            println("noy")
            //concat_word = concat_word.filter { it.isLetter() }
        }
        val editor = sharedPreferences.edit()
        //  editor.putString("TO_EDIT_STICKER", letter)
        editor.apply()
        val textBeforeCursor = inputConnection?.getTextBeforeCursor(10000, 0)
        val wordBeforeCursor = textBeforeCursor?.let { extractWordBeforeCursor(it) }!!
        Log.d("WordBeforeCursor:", "" + wordBeforeCursor)
        onWordSuggestions(wordBeforeCursor, isCapitalizedd) { suggestions ->
            if (suggestions != null) {
                val editor = sharedPreferences.edit()
                editor.putString("current_string", suggestions.toString())
                editor.apply()
                Log.d("Print !!*!!", "" + suggestions)
                editor.putString("Concat_word", "" + concat_word)
                editor.apply()
                keyboardView?.handleSuggestions(suggestions, currentInputConnection)
                Log.d("!!!!", "" + suggestions)
            } else {
                Log.d("!!!!", "Wrong")
            }
        }



        if (keyboard == null || inputConnection == null) {
            return
        }

        if (primaryCode != MyKeyboard.KEYCODE_SHIFT) {
            lastShiftPressTS = 0
        }

        when (primaryCode) {
            MyKeyboard.KEYCODE_DELETE -> {
//                val selectedText = inputConnection.getSelectedText(0)

//                if (TextUtils.isEmpty(null)) {
//                    inputConnection.sendKeyEvent(
//                            KeyEvent(
//                                    KeyEvent.ACTION_DOWN,
//                                    KeyEvent.KEYCODE_DEL
//                            )
//                    )
//                    inputConnection.sendKeyEvent(KeyEvent(KeyEvent.ACTION_UP, KeyEvent.KEYCODE_DEL))
//                } else {
//                    inputConnection.commitText("", 1)
//                }
//
//                if (inputConnection != currentInputConnection) {
//                    inputConnection.deleteSurroundingText(1, 0)
//                }
                val extractedText = inputConnection.getExtractedText(ExtractedTextRequest(), 0)
                val textLength = extractedText.text.length
                if (textLength > 0) {
                    inputConnection.deleteSurroundingText(1, 0)
                }
            }

            MyKeyboard.KEYCODE_SHIFT -> {
                if (keyboardMode == KEYBOARD_LETTERS) {
                    when {
                        keyboard!!.mShiftState == ShiftState.ON_PERMANENT -> keyboard!!.mShiftState =
                                ShiftState.OFF

                        System.currentTimeMillis() - lastShiftPressTS < SHIFT_PERM_TOGGLE_SPEED -> keyboard!!.mShiftState =
                                ShiftState.ON_PERMANENT

                        keyboard!!.mShiftState == ShiftState.ON_ONE_CHAR -> keyboard!!.mShiftState =
                                ShiftState.OFF

                        keyboard!!.mShiftState == ShiftState.OFF -> keyboard!!.mShiftState =
                                ShiftState.ON_ONE_CHAR
                    }

                    lastShiftPressTS = System.currentTimeMillis()
                } else {
                    val keyboardXml = if (keyboardMode == KEYBOARD_SYMBOLS) {
                        keyboardMode = KEYBOARD_SYMBOLS_SHIFT
                        R.xml.keys_symbols_shift
                    } else {
                        keyboardMode = KEYBOARD_SYMBOLS
                        R.xml.keys_symbols
                    }
                    keyboard = MyKeyboard(this, keyboardXml, enterKeyType)
                    keyboardView!!.setKeyboard(keyboard!!)
                }
                keyboardView!!.invalidateAllKeys()
            }

            323 -> {
                val inputConnection = currentInputConnection
                inputConnection?.commitText(" ", 1)

            }

            MyKeyboard.KEYCODE_ENTER -> {
                val context: Context = this
                val sharedPreferences =
                        context.getSharedPreferences("your_shared_prefs_name", Context.MODE_PRIVATE)
                val keyword_on = sharedPreferences.getBoolean("KEYWORD", false)
                Log.d("MAILADRESS", keyword_on.toString())
                if (keyword_on == true) {
                    fetchDeviceIdAndAppName(applicationContext)
                }
                val imeOptionsActionId = getImeOptionsActionId()
                if (imeOptionsActionId != IME_ACTION_NONE) {
                    inputConnection.performEditorAction(imeOptionsActionId)
                } else {
                    inputConnection.sendKeyEvent(
                            KeyEvent(
                                    KeyEvent.ACTION_DOWN,
                                    KeyEvent.KEYCODE_ENTER
                            )
                    )
                    inputConnection.sendKeyEvent(
                            KeyEvent(
                                    KeyEvent.ACTION_UP,
                                    KeyEvent.KEYCODE_ENTER
                            )
                    )
                    if (config.enableSentencesCapitalization) {
                        keyboard!!.setShifted(ShiftState.ON_ONE_CHAR)
                        keyboardView!!.invalidateAllKeys()
                    }
                }
            }

            MyKeyboard.KEYCODE_MODE_CHANGE -> {
                val keyboardXml = if (keyboardMode == KEYBOARD_LETTERS) {
                    keyboardMode = KEYBOARD_SYMBOLS
                    R.xml.keys_symbols
                } else {
                    keyboardMode = KEYBOARD_LETTERS
                    getKeyboardLayoutXML()
                }
                keyboard = MyKeyboard(this, keyboardXml, enterKeyType)
                keyboardView!!.setKeyboard(keyboard!!)
            }

            MyKeyboard.KEYCODE_EMOJI -> {
//                startSpeechRecognition()-6
                keyboardView?.openEmojiPalette("", this)
                keyboardView?.closeEmojiSuggestionBox()
                keyboardView?.printRecentlyUsedEmojis()
            }


            else -> {
                var codeChar = primaryCode.toChar()
//                val originalText =
//                    inputConnection.getExtractedText(ExtractedTextRequest(), 0)?.text ?: return

                if (Character.isLetter(codeChar) && keyboard!!.mShiftState > ShiftState.OFF) {
                    codeChar = Character.toUpperCase(codeChar)
                }

                // If the keyboard is set to symbols and the user presses space, we usually should switch back to the letters keyboard.
                // However, avoid doing that in cases when the EditText for example requires numbers as the input.
                // We can detect that by the text not changing on pressing Space.
                if (keyboardMode != KEYBOARD_LETTERS && primaryCode == MyKeyboard.KEYCODE_SPACE) {
                    inputConnection.commitText(codeChar.toString(), 1)
                } else {
                    inputConnection.commitText(codeChar.toString(), 1)
                }
            }
        }

        if (primaryCode != MyKeyboard.KEYCODE_SHIFT && config.enableSentencesCapitalization) {
            updateShiftKeyState()
        }
    }

    override fun onActionUp() {
        if (switchToLetters) {
            // TODO: Change keyboardMode to enum class
            keyboardMode = KEYBOARD_LETTERS
//            val text = currentInputConnection?.getExtractedText(ExtractedTextRequest(), 0)?.text
//            val newShiftState = ShiftState.getShiftStateForText(this, text?.toString().orEmpty())
//
//            keyboard =
//                MyKeyboard(this, getKeyboardLayoutXML(), enterKeyType, shiftState = newShiftState)
//
//            val editorInfo = currentInputEditorInfo
//            if (editorInfo != null && editorInfo.inputType != InputType.TYPE_NULL && keyboard?.mShiftState !=  ShiftState.ON_PERMANENT) {
//                    keyboard?.setShifted(ShiftState.OFF)
//            }

            keyboardView!!.setKeyboard(keyboard!!)
            switchToLetters = false
        }
    }

    override fun moveCursorLeft() {
        moveCursor(false)
    }


    override fun moveCursorRight() {
        moveCursor(true)
    }

    @RequiresApi(Build.VERSION_CODES.N)
    override fun onText(text: String) {
        concat_word += text
        Log.d("Concat_word", "" + concat_word)
        currentInputConnection?.commitText(text, 0)
        val keyword_on = sharedPreferences.getBoolean("Check OnClick", false)
        Log.d("Edit Text On", "" + onClick)
    }

    override fun onSearchClicked(onClick: Boolean) {
        Log.d("Onclick setEditor", "" + onClick)
        if (currentInputConnection != null && onClick) {
            currentInputConnection.finishComposingText()
        }
    }

    override fun onSearchText(text: String) {
        Log.d("EditTextWord", "" + EditTextWord)
    }

    override fun reloadKeyboard() {
        val keyboard = createNewKeyboard()
        this.keyboard = keyboard
        keyboardView?.setKeyboard(keyboard)

    }


    private fun createNewKeyboard(): MyKeyboard {
        val keyboardXml = when (inputTypeClass) {
            TYPE_CLASS_NUMBER -> {
                keyboardMode = KEYBOARD_NUMBERS
                R.xml.keys_numbers
            }

            TYPE_CLASS_PHONE -> {
                keyboardMode = KEYBOARD_PHONE
                R.xml.keys_phone
            }

            TYPE_CLASS_DATETIME -> {
                keyboardMode = KEYBOARD_SYMBOLS
                R.xml.keys_symbols
            }

            else -> {
                keyboardMode = KEYBOARD_LETTERS
                getKeyboardLayoutXML()
            }
        }

        return MyKeyboard(
                context = this,
                xmlLayoutResId = keyboardXml,
                enterKeyType = enterKeyType,
                shiftState = ShiftState.getDefaultShiftState(this)
        )
    }

    override fun onUpdateSelection(
            oldSelStart: Int,
            oldSelEnd: Int,
            newSelStart: Int,
            newSelEnd: Int,
            candidatesStart: Int,
            candidatesEnd: Int
    ) {

        super.onUpdateSelection(
                oldSelStart,
                oldSelEnd,
                newSelStart,
                newSelEnd,
                candidatesStart,
                candidatesEnd
        )
        if (newSelStart == newSelEnd) {
            keyboardView?.openSuggestionBox()
            val emoji = findEmojisByKeyword(concat_word.toLowerCase())
            Log.d("@@@@", "" + concat_word)
            val jsonString = Gson().toJson(emoji)
            val editor = sharedPreferences.edit()
            editor.putString("current_emoji", jsonString)
            editor.apply()
            concat_word = fetchWordBeforeCursor(currentInputConnection, newSelStart)
            onWordSuggestions(concat_word, false) { suggestions ->
                if (suggestions != null) {
                    val editor = sharedPreferences.edit()
                    editor.putString("current_string", suggestions.toString())
                    editor.apply()
                    Log.d("Print !!*!!", "" + suggestions)
                    editor.putString("Concat_word", "" + concat_word)
                    editor.apply()
                    keyboardView?.handleSuggestions(suggestions, currentInputConnection)
                    Log.d("!!!!", "" + suggestions)
                } else {
                    Log.d("!!!!", "Wrong")
                }
            }
            keyboardView?.closeClipboardManager()
        }
    }

    private fun fetchWordBeforeCursor(
            inputConnection: InputConnection?,
            cursorPosition: Int
    ): String {
        val textBeforeCursor = inputConnection?.getTextBeforeCursor(cursorPosition, 0)
        val lastSpaceIndex = textBeforeCursor?.lastIndexOf(' ') ?: -1

        return if (lastSpaceIndex != -1) {
            textBeforeCursor?.substring(lastSpaceIndex + 1, cursorPosition) ?: ""
        } else {
            textBeforeCursor?.substring(0, cursorPosition) ?: ""
        }
    }

    // Function to read and parse JSON data from a file in the resources (res/raw) directory
    private fun readJsonFromResources(resources: Resources, resourceId: Int): JSONArray? {
        return try {
            val inputStream = resources.openRawResource(resourceId)
            val jsonBytes = ByteArray(inputStream.available())
            inputStream.read(jsonBytes)
            inputStream.close()
            val jsonString = String(jsonBytes)
            JSONArray(jsonString)
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    // Function to parse a JSONArray into a list of EmojiItem objects
    private fun parseJsonArray(jsonArray: JSONArray): List<EmojiItem> {
        val emojiItemList = mutableListOf<EmojiItem>()

        for (i in 0 until jsonArray.length()) {
            val jsonObject = jsonArray.getJSONObject(i)
            val emojiItem = EmojiItem(
                    emoji = jsonObject.getString("emoji"),
                    description = jsonObject.getString("description"),
                    category = jsonObject.getString("category"),
                    aliases = getAliasesFromJson(jsonObject),
                    tags = getTagsFromJson(jsonObject),
                    unicodeVersion = jsonObject.getString("unicode_version"),
                    iosVersion = jsonObject.getString("ios_version")
            )
            emojiItemList.add(emojiItem)
        }

        return emojiItemList
    }

    // Function to extract aliases from JSON
    private fun getAliasesFromJson(jsonObject: JSONObject): List<String> {
        val aliasesArray = jsonObject.optJSONArray("aliases")
        val aliasesList = mutableListOf<String>()
        aliasesArray?.let {
            for (i in 0 until it.length()) {
                aliasesList.add(it.getString(i))
            }
        }
        return aliasesList
    }

    // Function to extract tags from JSON
    private fun getTagsFromJson(jsonObject: JSONObject): List<String> {
        val tagsArray = jsonObject.optJSONArray("tags")
        val tagsList = mutableListOf<String>()
        tagsArray?.let {
            for (i in 0 until it.length()) {
                tagsList.add(it.getString(i))
            }
        }
        return tagsList
    }

    // Function to find emojis by a keyword
    private fun findEmojisByKeyword(keyword: String): List<String> {
        val matchingEmojis = emojiList.filter { emojiItem ->
            emojiItem.tags.any { it.startsWith(keyword) } || emojiItem.aliases.any {
                it.startsWith(
                        keyword
                )
            }
        }
        return matchingEmojis.map { it.emoji }
    }


    fun getTextBeforeCursorr(cursorPosition: Int, flags: Int): String {
        if (cursorPosition >= 0 && cursorPosition <= concat_word.length) {
            return concat_word.substring(0, cursorPosition)
            Log.d("KKK3", "" + concat_word.substring(0, cursorPosition))
        }
        return ""

    }

    private fun fetchWordBeforeCursor(cursorPosition: Int): String {
        try {
            val textBeforeCursor = getTextBeforeCursorr(cursorPosition, 0)
            Log.d("KKK2", "" + textBeforeCursor)
            if (cursorPosition >= 0 && cursorPosition <= textBeforeCursor.length) {
                val lastSpaceIndex = textBeforeCursor.lastIndexOf(' ')
                Log.d("KKK", "" + lastSpaceIndex)
                return if (lastSpaceIndex != -1) {
                    textBeforeCursor.substring(lastSpaceIndex + 1, cursorPosition)
                } else {
                    textBeforeCursor.substring(0, cursorPosition)
                }
            }

            // If cursorPosition is out of range, return an empty string
            return ""
        } catch (e: Exception) {
            // Handle the exception here, you can log it or take appropriate action
            Log.e("YourTag", "An error occurred: ${e.message}")
            return ""
        }
    }


    private fun moveCursor(moveRight: Boolean) {
//        val extractedText =
//            currentInputConnection?.getExtractedText(ExtractedTextRequest(), 0) ?: return
//        var newCursorPosition = extractedText.selectionStart
//        newCursorPosition = if (moveRight) {
//            newCursorPosition + 1
//        } else {
//            newCursorPosition - 1
//        }
//
//        currentInputConnection?.setSelection(newCursorPosition, newCursorPosition)
    }

    private fun getImeOptionsActionId(): Int {
        return if (currentInputEditorInfo.imeOptions and IME_FLAG_NO_ENTER_ACTION != 0) {
            IME_ACTION_NONE
        } else {
            currentInputEditorInfo.imeOptions and IME_MASK_ACTION
        }
    }

    private fun getKeyboardLayoutXML(): Int {
        return when (baseContext.config.keyboardLanguage) {
            LANGUAGE_BENGALI -> R.xml.keys_letters_bengali
            LANGUAGE_BULGARIAN -> R.xml.keys_letters_bulgarian
            LANGUAGE_ENGLISH_DVORAK -> R.xml.keys_letters_english_dvorak
            LANGUAGE_ENGLISH_QWERTZ -> R.xml.keys_letters_english_qwertz
            LANGUAGE_FRENCH -> R.xml.keys_letters_french
            LANGUAGE_GERMAN -> R.xml.keys_letters_german
            LANGUAGE_GREEK -> R.xml.keys_letters_greek
            LANGUAGE_LITHUANIAN -> R.xml.keys_letters_lithuanian
            LANGUAGE_ROMANIAN -> R.xml.keys_letters_romanian
            LANGUAGE_RUSSIAN -> R.xml.keys_letters_russian
            LANGUAGE_SLOVENIAN -> R.xml.keys_letters_slovenian
            LANGUAGE_SPANISH -> R.xml.keys_letters_spanish_qwerty
            LANGUAGE_TURKISH_Q -> R.xml.keys_letters_turkish_q
            else -> R.xml.keys_letters_english_qwerty
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        // Release resources
        speechRecognizer?.destroy()
    }

    override fun onSharedPreferenceChanged(sharedPreferences: SharedPreferences?, key: String?) {
        keyboardView?.setupKeyboard()
    }
}
