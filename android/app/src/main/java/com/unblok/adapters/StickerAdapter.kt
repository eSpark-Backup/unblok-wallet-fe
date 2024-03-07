package com.unblok.adapters

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.unblock.R
import com.unblok.Datum

class StickerAdapter(
    private val context: Context,
    private var stickers: List<Datum>
) :
    RecyclerView.Adapter<StickerAdapter.StickerViewHolder>() {
    private val layoutInflater = LayoutInflater.from(context)
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): StickerViewHolder {
        val layoutId = R.layout.item_sticker
        val view = layoutInflater.inflate(layoutId, parent, false)
        return StickerViewHolder(view)
    }

    override fun onBindViewHolder(holder: StickerViewHolder, position: Int) {
        val sticker = stickers[position]
        holder.bindView(sticker) { itemView ->
            setupSticker(itemView, sticker)
        }


    }

    override fun getItemCount(): Int {
        return stickers.size
    }

    fun setData(newStickers: List<Datum>) {
        stickers = newStickers
        notifyDataSetChanged()
    }

    private fun setupSticker(view: View, stickerUrl: Datum) {
        val stickerImageView: ImageView = view.findViewById(R.id.sticker_value)

        Glide.with(view)
            .asGif()
            .load(stickerUrl.images.original.url)
            .into(stickerImageView)
    }

    inner class StickerViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {

        fun bindView(sticker: Datum, callback: (itemView: View) -> Unit): View {
            return itemView.apply {
                callback(this)
                itemView.setOnClickListener {
                    handleStickerClick(sticker)
                }
            }

        }
    }

    private fun handleStickerClick(sticker: Datum) {
        // Handle sticker click event here
        // You can add your own implementation
    }
}