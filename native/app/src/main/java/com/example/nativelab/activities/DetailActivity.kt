package com.example.nativelab.activities

import android.app.AlertDialog
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import com.example.nativelab.MainActivity
import com.example.nativelab.R
import com.example.nativelab.model.Assignment
import com.example.nativelab.repository.Repository


class DetailActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_detail)

        // Get the repository from main activity
        val repo = intent.getParcelableExtra<Repository>("Repo")

        // Get the assignment
        val assignment = intent.getParcelableExtra<Assignment>(MainActivity.INTENT_PARCELABLE)

        val title = findViewById<TextView>(R.id._assTitle)
        val course = findViewById<TextView>(R.id._assCourse)
        val number = findViewById<TextView>(R.id._assNumber)
        val mandatory = findViewById<TextView>(R.id._assMandatory)
        val problemAssigned = findViewById<TextView>(R.id._assProblem)
        val date = findViewById<TextView>(R.id._assDate)
        var deleteTitle = ""

        if (assignment != null) {
            deleteTitle = assignment.title
            title.text = assignment.title
            course.text = assignment.course
            number.text = assignment.number.toString()

            if (assignment.mandatory) {
                mandatory.text = "Yes"
            } else {
                mandatory.text = "No"
            }
            problemAssigned.text = assignment.problem.toString()
            date.text = assignment.date
        }

        // Edit button handler -> start another activity
        val editButton = findViewById<Button>(R.id._updateButton)

        editButton.setOnClickListener {
            val intent = Intent(this, Update::class.java)
            intent.putExtra("Repo", repo)
            intent.putExtra("Assignment", assignment)
            startActivity(intent)
            finish()
        }

        // Delete button handler -> confirmation dialog
        val deleteButton = findViewById<Button>(R.id._deleteButton)

        deleteButton.setOnClickListener {
            val builder = AlertDialog.Builder(this)
            builder.setMessage("Are you sure you want to remove $deleteTitle?")
                .setCancelable(false)
                .setPositiveButton("Yes") { _, _ ->
                    // Delete selected note from database
                    if (assignment != null) {
                        repo?.deleteAssignment(assignment)
                    }

                    // After deleting the assignment, navigate to the main page
                    val intent = Intent(this, MainActivity::class.java)
                    startActivity(intent)
                    finish()
                }
                .setNegativeButton("No") { dialog, _ ->
                    // Dismiss the dialog
                    dialog.dismiss()
                }
            val alert = builder.create()
            alert.show()
        }
    }
}