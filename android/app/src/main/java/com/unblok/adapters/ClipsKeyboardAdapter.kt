package com.simplemobiletools.keyboard.adapters

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.drawable.LayerDrawable
import android.graphics.drawable.RippleDrawable
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.RelativeLayout
import androidx.recyclerview.widget.RecyclerView
import androidx.recyclerview.widget.StaggeredGridLayoutManager
import com.simplemobiletools.commons.extensions.*
import com.simplemobiletools.commons.helpers.ensureBackgroundThread
import com.simplemobiletools.commons.views.MyTextView
import com.simplemobiletools.keyboard.extensions.clipsDB
import com.simplemobiletools.keyboard.extensions.config
import com.simplemobiletools.keyboard.extensions.getCurrentClip
import com.simplemobiletools.keyboard.extensions.getStrokeColor
import com.simplemobiletools.keyboard.extensions.recentclipsDB
import com.simplemobiletools.keyboard.helpers.ClipsHelper
import com.simplemobiletools.keyboard.helpers.ITEM_CLIP
import com.simplemobiletools.keyboard.helpers.ITEM_SECTION_LABEL
import com.simplemobiletools.keyboard.interfaces.RefreshClipsListener
import com.simplemobiletools.keyboard.models.Clip
import com.simplemobiletools.keyboard.models.ClipsSectionLabel
import com.simplemobiletools.keyboard.models.ListItem
import com.unblock.R

class ClipsKeyboardAdapter(
    val context: Context,
    var items: ArrayList<ListItem>,
    val refreshClipsListener: RefreshClipsListener,
    val itemClick: (clip: Clip) -> Unit
) : RecyclerView.Adapter<ClipsKeyboardAdapter.ViewHolder>() {

    private val layoutInflater = LayoutInflater.from(context)
    private var textColor = context.getProperTextColor()
    private var backgroundColor = context.getProperBackgroundColor()

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val layoutId = when (viewType) {
            ITEM_SECTION_LABEL -> R.layout.item_section_label
            else -> R.layout.item_clip_on_keyboard
        }

        val view = layoutInflater.inflate(layoutId, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val item = items[position]
        holder.bindView(item) { itemView ->
            when (item) {
                is Clip -> setupClip(itemView, item)
                is ClipsSectionLabel -> setupSection(itemView, item)
            }

            (itemView.layoutParams as StaggeredGridLayoutManager.LayoutParams).isFullSpan =
                item is ClipsSectionLabel
        }
    }

    override fun getItemCount() = items.size

    override fun getItemViewType(position: Int) = when {
        items[position] is ClipsSectionLabel -> ITEM_SECTION_LABEL
        else -> ITEM_CLIP
    }

    private fun setupClip(view: View, clip: Clip) {
        view.apply {
            val rippleBg = findViewById<RelativeLayout>(R.id.clip_holder).background as RippleDrawable
            val layerDrawable =
                rippleBg.findDrawableByLayerId(R.id.clipboard_background_holder) as LayerDrawable
            layerDrawable.findDrawableByLayerId(R.id.clipboard_background_stroke)
                .applyColorFilter(context.getStrokeColor())
            layerDrawable.findDrawableByLayerId(R.id.clipboard_background_shape)
                .applyColorFilter(backgroundColor)


            findViewById<MyTextView>(R.id.clip_value).apply {
                text = clip.value
                removeUnderlines()
                setTextColor(textColor)
            }
            findViewById<ImageView>(R.id.pin_text).apply {
                applyColorFilter(textColor)
                setOnClickListener {
                    ensureBackgroundThread {
//                        val clipId = view.tag as Long
                        val currentClip = context.getCurrentClip() ?: return@ensureBackgroundThread
                        val clip = Clip(clip.id, clip.value, false)
                        Log.d("Clip:",""+clip)
                        ClipsHelper(context).insertClip(clip)
                        refreshClipsListener.refreshClips()
                        context.toast(R.string.text_pinned)
                        if (context.config.vibrateOnKeypress) {
                            performHapticFeedback()
                        }
                    }
                }
            }
            findViewById<ImageView>(R.id.clips_delete_icon).apply {
                applyColorFilter(textColor)
                findViewById<ImageView>(R.id.clips_delete_icon).setOnClickListener {
                    ensureBackgroundThread {
                        val clips = java.util.ArrayList<ListItem>()
                        val clipToDelete = clip // Assuming "clip" is the current clip object
                        Log.d("CliptoDelete", "" + clipToDelete)
                        clipToDelete.id?.let { it1 -> context.clipsDB.delete(it1) }
                        clipToDelete.id?.let { it1 -> context.recentclipsDB.delete(it1) }
                        if(clipToDelete.id == null) {
                            clips.remove(clipToDelete)
                        }
                            refreshClipsListener.refreshClips()

                    }
                }
            }
        }
    }

    @SuppressLint("UseCompatLoadingForDrawables")
    private fun setupSection(view: View, sectionLabel: ClipsSectionLabel) {
        view.apply {
            findViewById<MyTextView>(R.id.clips_section_label).apply {
                text = sectionLabel.value
                setTextColor(textColor)
            }
        }
    }

    open inner class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        fun bindView(any: Any, callback: (itemView: View) -> Unit): View {
            return itemView.apply {
                callback(this)

                if (any is Clip) {
                    setOnClickListener {
                        itemClick.invoke(any)
                    }
                }
            }
        }
    }
}
