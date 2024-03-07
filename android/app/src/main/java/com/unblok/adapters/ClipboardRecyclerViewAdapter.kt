package com.unblok.adapters

import android.content.Context
import android.graphics.drawable.LayerDrawable
import android.graphics.drawable.RippleDrawable
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.simplemobiletools.commons.extensions.applyColorFilter
import com.simplemobiletools.commons.extensions.getProperBackgroundColor
import com.simplemobiletools.commons.extensions.getProperTextColor
import com.simplemobiletools.keyboard.extensions.getStrokeColor
import com.simplemobiletools.keyboard.interfaces.RefreshClipsListener
import com.unblock.R
import com.unblok.ClipboardItem

class ClipboardRecyclerViewAdapter(val context: Context, private val items: MutableList<ClipboardItem>,
                                   val refreshClipsListener: RefreshClipsListener,
                                   private val itemClick: (clip: ClipboardItem) -> Unit) :
    RecyclerView.Adapter<ClipboardRecyclerViewAdapter.ViewHolder>() {
    private val clipboardItems = mutableListOf<ClipboardItem>()
    private val adapter: ClipboardRecyclerViewAdapter? = null
    private val layoutInflater = LayoutInflater.from(context)
    private var backgroundColor = context.getProperBackgroundColor()
    private var textColor = context.getProperTextColor()


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_clip_on_keyboard, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val item = items[position]
//        holder.pin_text.text = item.text
//        holder.pinButton.isChecked = item.pinned
//      .setOnClickListener {
//            item.pinned = !item.pinned
//            notifyItemChanged(position)
//        }
//        holder.deleteButton.setOnClickListener {
//            items.removeAt(position)
//            notifyItemRemoved(position)
//        }
    }

    override fun getItemCount(): Int {
        return items.size
    }


    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {

//        fun bindView(item: ClipboardItem, callback: (itemView: View) -> Unit) {
//            itemView.apply {
//                val rippleBg = clip_holder.background as RippleDrawable
//                val layerDrawable =
//                    rippleBg.findDrawableByLayerId(R.id.clipboard_background_holder) as LayerDrawable
//                layerDrawable.findDrawableByLayerId(R.id.clipboard_background_stroke)
//                    .applyColorFilter(context.getStrokeColor())
//                layerDrawable.findDrawableByLayerId(R.id.clipboard_background_shape)
//                    .applyColorFilter(backgroundColor)
//
//                clip_value.text = item.text
////                pin_text.isChecked = item.pinned
//                pin_text.apply {
//                    applyColorFilter(textColor)
//                    pin_text.setOnClickListener {
//                        item.pinned = !item.pinned
//                        rearrangeItems()
//                    }
//                }
//                clips_delete_icon.apply {
//                    applyColorFilter(textColor)
//                    clips_delete_icon.setOnClickListener {
//                        val position = adapterPosition
//                        if (position != RecyclerView.NO_POSITION) {
//                            items.removeAt(position)
//                            notifyItemRemoved(position)
//                            rearrangeItems()
//                        }
//                    }
//                }
//                clip_value.apply {
//                    setTextColor(textColor)
//                    clip_value.setOnClickListener {
//                        itemClick.invoke(item)
//                    }
//                }
//
//                callback(itemView)
//            }
//        }
    }
    private fun rearrangeItems() {
        items.sortWith(compareByDescending<ClipboardItem> { it.pinned })
        notifyDataSetChanged()
    }
    fun pinItem(position: Int) {
        if (position >= 0 && position < clipboardItems.size) {
            val item = clipboardItems[position]
            item.pinned = !item.pinned
            rearrangeItems()
        }
    }

    fun deleteItem(position: Int) {
        if (position >= 0 && position < clipboardItems.size) {
            clipboardItems.removeAt(position)
            adapter?.notifyItemRemoved(position)
        }
    }

}
