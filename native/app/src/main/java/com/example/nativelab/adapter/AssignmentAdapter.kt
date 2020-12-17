package com.example.nativelab.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.nativelab.R
import com.example.nativelab.model.Assignment

class AssignmentAdapter (
    private val context: Context,
    private val assignments: List<Assignment>,
    val listener: (Assignment) -> Unit
) : RecyclerView.Adapter<AssignmentAdapter.AssignmentViewHolder>() {
    class AssignmentViewHolder(view : View) : RecyclerView.ViewHolder(view) {
        val title = view.findViewById<TextView>(R.id._title)
        fun bindView(assignment: Assignment, listener: (Assignment) -> Unit) {
            title.text = assignment.title
            itemView.setOnClickListener { listener(assignment) }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): AssignmentViewHolder
    = AssignmentViewHolder(
        LayoutInflater.from(context)
            .inflate(R.layout.item_title, parent, false)
    )

    override fun getItemCount(): Int = assignments.size

    override fun onBindViewHolder(holder: AssignmentViewHolder, position: Int) {
        holder.bindView(assignments[position], listener)
    }
}