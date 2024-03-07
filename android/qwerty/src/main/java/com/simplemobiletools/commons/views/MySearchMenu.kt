package com.simplemobiletools.commons.views

import android.app.Activity
import android.content.Context
import android.util.AttributeSet
import android.widget.EditText
import android.widget.ImageView
import android.widget.RelativeLayout
import com.google.android.material.appbar.AppBarLayout
import com.google.android.material.appbar.MaterialToolbar
import com.simplemobiletools.commons.R
import com.simplemobiletools.commons.activities.BaseSimpleActivity
import com.simplemobiletools.commons.extensions.*
import com.simplemobiletools.commons.helpers.LOWER_ALPHA
import com.simplemobiletools.commons.helpers.MEDIUM_ALPHA

class MySearchMenu(context: Context, attrs: AttributeSet) : AppBarLayout(context, attrs) {
    var isSearchOpen = false
    var useArrowIcon = false
    var onSearchOpenListener: (() -> Unit)? = null
    var onSearchClosedListener: (() -> Unit)? = null
    var onSearchTextChangedListener: ((text: String) -> Unit)? = null
    var onNavigateBackClickListener: (() -> Unit)? = null

    init {
        inflate(context, R.layout.menu_search, this)
    }

    fun getToolbar() = findViewById<MaterialToolbar>(R.id.top_toolbar)

    fun setupMenu() {
        findViewById<ImageView>(R.id.top_toolbar_search_icon).setOnClickListener {
            if (isSearchOpen) {
                closeSearch()
            } else if (useArrowIcon && onNavigateBackClickListener != null) {
                onNavigateBackClickListener!!()
            } else {
                findViewById<EditText>(R.id.top_toolbar_search).requestFocus()
                (context as? Activity)?.showKeyboard(findViewById(R.id.top_toolbar_search))
            }
        }

        post {
            findViewById<EditText>(R.id.top_toolbar_search).setOnFocusChangeListener { v, hasFocus ->
                if (hasFocus) {
                    openSearch()
                }
            }
        }

        findViewById<EditText>(R.id.top_toolbar_search).onTextChangeListener { text ->
            onSearchTextChangedListener?.invoke(text)
        }
    }

    fun focusView() {
        findViewById<EditText>(R.id.top_toolbar_search).requestFocus()
    }

    private fun openSearch() {
        isSearchOpen = true
        onSearchOpenListener?.invoke()
        findViewById<ImageView>(R.id.top_toolbar_search_icon).setImageResource(R.drawable.ic_arrow_left_vector)
        findViewById<ImageView>(R.id.top_toolbar_search_icon).contentDescription = resources.getString(R.string.back)
    }

    fun closeSearch() {
        isSearchOpen = false
        onSearchClosedListener?.invoke()
        findViewById<EditText>(R.id.top_toolbar_search).setText("")
        if (!useArrowIcon) {
            findViewById<ImageView>(R.id.top_toolbar_search_icon).setImageResource(R.drawable.ic_search_vector)
            findViewById<ImageView>(R.id.top_toolbar_search_icon).contentDescription = resources.getString(R.string.search)
        }
        (context as? Activity)?.hideKeyboard()
    }

    fun getCurrentQuery() = findViewById<EditText>(R.id.top_toolbar_search).text.toString()

    fun updateHintText(text: String) {
        findViewById<EditText>(R.id.top_toolbar_search).hint = text
    }

    fun toggleHideOnScroll(hideOnScroll: Boolean) {
        val params =  findViewById<AppBarLayout>(R.id.top_app_bar_layout).layoutParams as LayoutParams
        if (hideOnScroll) {
            params.scrollFlags = LayoutParams.SCROLL_FLAG_SCROLL or LayoutParams.SCROLL_FLAG_ENTER_ALWAYS
        } else {
            params.scrollFlags = params.scrollFlags.removeBit(LayoutParams.SCROLL_FLAG_SCROLL or LayoutParams.SCROLL_FLAG_ENTER_ALWAYS)
        }
    }

    fun toggleForceArrowBackIcon(useArrowBack: Boolean) {
        this.useArrowIcon = useArrowBack
        val (icon, accessibilityString) = if (useArrowBack) {
            Pair(R.drawable.ic_arrow_left_vector, R.string.back)
        } else {
            Pair(R.drawable.ic_search_vector, R.string.search)
        }

        findViewById<ImageView>(R.id.top_toolbar_search_icon).setImageResource(icon)
        findViewById<ImageView>(R.id.top_toolbar_search_icon).contentDescription = resources.getString(accessibilityString)
    }

    fun updateColors() {
        val backgroundColor = context.getProperBackgroundColor()
        val contrastColor = backgroundColor.getContrastColor()

        setBackgroundColor(backgroundColor)
        findViewById<AppBarLayout>(R.id.top_app_bar_layout).setBackgroundColor(backgroundColor)
        findViewById<ImageView>(R.id.top_toolbar_search_icon).applyColorFilter(contrastColor)
        findViewById<RelativeLayout>(R.id.top_toolbar_holder).background?.applyColorFilter(context.getProperPrimaryColor().adjustAlpha(LOWER_ALPHA))
        findViewById<EditText>(R.id.top_toolbar_search).setTextColor(contrastColor)
        findViewById<EditText>(R.id.top_toolbar_search).setHintTextColor(contrastColor.adjustAlpha(MEDIUM_ALPHA))
        (context as? BaseSimpleActivity)?.updateTopBarColors(findViewById<MaterialToolbar>(R.id.top_toolbar), backgroundColor)
    }
}
