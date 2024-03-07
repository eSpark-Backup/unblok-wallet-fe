package com.simplemobiletools.commons.views

import android.content.Context
import android.util.AttributeSet
import android.widget.ImageView
import android.widget.RelativeLayout
import androidx.biometric.auth.AuthPromptHost
import com.google.android.material.textfield.TextInputEditText
import com.simplemobiletools.commons.R
import com.simplemobiletools.commons.extensions.*
import com.simplemobiletools.commons.helpers.PROTECTION_PIN
import com.simplemobiletools.commons.interfaces.HashListener
import com.simplemobiletools.commons.interfaces.SecurityTab
import java.math.BigInteger
import java.security.MessageDigest
import java.util.*

class PinTab(context: Context, attrs: AttributeSet) : RelativeLayout(context, attrs), SecurityTab {
    private var hash = ""
    private var requiredHash = ""
    private var pin = ""
    lateinit var hashListener: HashListener

    override fun onFinishInflate() {
        super.onFinishInflate()
        context.updateTextColors(findViewById<PinTab>(R.id.pin_lock_holder))

        findViewById<MyTextView>(R.id.pin_0).setOnClickListener { addNumber("0") }
        findViewById<MyTextView>(R.id.pin_1).setOnClickListener { addNumber("1") }
        findViewById<MyTextView>(R.id.pin_2).setOnClickListener { addNumber("2") }
        findViewById<MyTextView>(R.id.pin_3).setOnClickListener { addNumber("3") }
                findViewById<MyTextView>(R.id.pin_4).setOnClickListener { addNumber("4") }
                findViewById<MyTextView>(R.id.pin_5).setOnClickListener { addNumber("5") }
                findViewById<MyTextView>(R.id.pin_6).setOnClickListener { addNumber("6") }
                findViewById<MyTextView>(R.id.pin_7).setOnClickListener { addNumber("7") }
                findViewById<MyTextView>(R.id.pin_8).setOnClickListener { addNumber("8") }
                findViewById<MyTextView>(R.id.pin_9).setOnClickListener { addNumber("9") }
                findViewById<MyTextView>(R.id.pin_c).setOnClickListener { clear() }
                findViewById<ImageView>(R.id.pin_ok).setOnClickListener { confirmPIN() }
                findViewById<ImageView>(R.id.pin_ok).applyColorFilter(context.getProperTextColor())
    }

    override fun initTab(
        requiredHash: String,
        listener: HashListener,
        scrollView: MyScrollView,
        biometricPromptHost: AuthPromptHost,
        showBiometricAuthentication: Boolean
    ) {
        this.requiredHash = requiredHash
        hash = requiredHash
        hashListener = listener
    }

    private fun addNumber(number: String) {
        if (pin.length < 10) {
            pin += number
            updatePinCode()
        }
        performHapticFeedback()
    }

    private fun clear() {
        if (pin.isNotEmpty()) {
            pin = pin.substring(0, pin.length - 1)
            updatePinCode()
        }
        performHapticFeedback()
    }

    private fun confirmPIN() {
        val newHash = getHashedPin()
        if (pin.isEmpty()) {
            context.toast(R.string.please_enter_pin)
        } else if (hash.isEmpty()) {
            hash = newHash
            resetPin()
            findViewById<MyTextView>(R.id.pin_lock_title).setText(R.string.repeat_pin)
        } else if (hash == newHash) {
            hashListener.receivedHash(hash, PROTECTION_PIN)
        } else {
            resetPin()
            context.toast(R.string.wrong_pin)
            if (requiredHash.isEmpty()) {
                hash = ""
                findViewById<MyTextView>(R.id.pin_lock_title).setText(R.string.enter_pin)
            }
        }
        performHapticFeedback()
    }

    private fun resetPin() {
        pin = ""
        findViewById<MyTextView>(R.id.pin_lock_current_pin).text = ""
    }

    private fun updatePinCode() {
        findViewById<MyTextView>(R.id.pin_lock_current_pin).text = "*".repeat(pin.length)
        if (hash.isNotEmpty() && hash == getHashedPin()) {
            hashListener.receivedHash(hash, PROTECTION_PIN)
        }
    }

    private fun getHashedPin(): String {
        val messageDigest = MessageDigest.getInstance("SHA-1")
        messageDigest.update(pin.toByteArray(charset("UTF-8")))
        val digest = messageDigest.digest()
        val bigInteger = BigInteger(1, digest)
        return String.format(Locale.getDefault(), "%0${digest.size * 2}x", bigInteger).lowercase(Locale.getDefault())
    }

    override fun visibilityChanged(isVisible: Boolean) {}
}
