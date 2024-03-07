package com.unblok.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.unblok.ClipboardItem

//class clipboardAdapter(
//    private val clipboardItems: MutableList<ClipboardItem>,
//    private val onPinClickListener: (Int) -> Unit,
//    private val onDeleteClickListener: (Int) -> Unit
//) : RecyclerView.Adapter<clipboardAdapter.ViewHolder>() {
//
//    inner class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
//        val textView: TextView = view.findViewById(R.id.clip_value)
//        val pinButton: Button = view.findViewById(R.id.pin_text)
//        val deleteButton: Button = view.findViewById(R.id.clips_delete_icon)
//    }
//
//    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
//        val itemView = LayoutInflater.from(parent.context).inflate(R.layout.item_clip_on_keyboard, parent, false)
//        return ViewHolder(itemView)
//    }
//
//    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
//        val clip = clipboardItems[position]
//        holder.textView.text = clip.text
//
//        // Handle pin/unpin button click
//        holder.pinButton.setOnClickListener {
//            onPinClickListener(position)
//        }
//
//        // Handle delete button click
//        holder.deleteButton.setOnClickListener {
//            onDeleteClickListener(position)
//        }
//    }
//
//    override fun getItemCount(): Int {
//        return clipboardItems.size
//    }
//}
