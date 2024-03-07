package com.unblok.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.RelativeLayout
import android.widget.TextView
import androidx.appcompat.widget.AppCompatTextView
import androidx.emoji2.text.EmojiCompat
import androidx.recyclerview.widget.RecyclerView
import com.unblock.R

class EmojiAdapter(private var emojis: List<String>,    private val itemClick: (emoji: String) -> Unit) :
    RecyclerView.Adapter<EmojiAdapter.EmojiViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): EmojiViewHolder {
        val itemView =
            LayoutInflater.from(parent.context).inflate(R.layout.item_emoji, parent, false)
        return EmojiViewHolder(itemView)
    }

    override fun onBindViewHolder(holder: EmojiViewHolder, position: Int) {
        val emoji = emojis[position]
        holder.bindView(emoji) { itemView ->
            setupEmoji(itemView, emoji)
        }
    }
    private fun setupEmoji(view: View, emoji: String) {
        view.findViewById<AppCompatTextView>(R.id.emoji_value).text = emoji
    }

    override fun getItemCount(): Int {
        return emojis.size
    }
    fun updateEmojis(newEmojis: List<String>) {
        emojis = newEmojis
        notifyDataSetChanged()
    }

    inner class EmojiViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
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
