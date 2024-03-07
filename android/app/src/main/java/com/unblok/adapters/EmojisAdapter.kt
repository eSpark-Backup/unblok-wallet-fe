package com.simplemobiletools.keyboard.adapters

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.widget.AppCompatTextView
import androidx.emoji2.text.EmojiCompat
import androidx.recyclerview.widget.RecyclerView
import com.unblock.R


class EmojisAdapter(
    private val context: Context,
    private var items: List<String>,
    private val itemClick: (emoji: String) -> Unit
) : RecyclerView.Adapter<EmojisAdapter.ViewHolder>() {

    private val layoutInflater = LayoutInflater.from(context)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): EmojisAdapter.ViewHolder {
        val layoutId = R.layout.item_emoji
        val view = layoutInflater.inflate(layoutId, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: EmojisAdapter.ViewHolder, position: Int) {
        val item = items[position]
        holder.bindView(item) { itemView ->
            setupEmoji(itemView, item)
        }
    }

    override fun getItemCount(): Int = items.size

    private fun setupEmoji(view: View, emoji: String) {
        val processed = EmojiCompat.get().process(emoji)
        view.findViewById<AppCompatTextView>(R.id.emoji_value).text = processed
    }
    fun updateEmojis(newEmojis: List<String>) {
        items = newEmojis
        notifyDataSetChanged()
    }
    fun setEmojis(emojis: List<String>) {
        items = emojis
        notifyDataSetChanged()
    }


    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        fun bindView(emoji: String, callback: (itemView: View) -> Unit): View {
            return itemView.apply {
                callback(this)
                setOnClickListener {
                    itemClick.invoke(emoji)
                }
            }
        }
    }
}
