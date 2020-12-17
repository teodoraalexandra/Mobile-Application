package com.example.nativelab.activities

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.widget.CheckBox
import android.widget.EditText
import com.example.nativelab.MainActivity
import com.example.nativelab.R
import com.example.nativelab.model.Assignment
import com.example.nativelab.repository.Repository

class Update : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_update)

        // Get the assignment from detail activity
        val assignment = intent.getParcelableExtra<Assignment>("Assignment")

        // Fill the editable data with assignment attributes
        val title = findViewById<EditText>(R.id._updateTitle)
        val course = findViewById<EditText>(R.id._updateCourse)
        val number = findViewById<EditText>(R.id._updateNumber)
        val mandatory = findViewById<CheckBox>(R.id._updateMandatory)
        val problemAssigned = findViewById<EditText>(R.id._updateProblem)
        val date = findViewById<EditText>(R.id._updateDate)

        if (assignment != null) {
            title.setText(assignment.title)
            course.setText(assignment.course)
            number.setText(assignment.number.toString())

            mandatory.isChecked = assignment.mandatory
            problemAssigned.setText(assignment.problem.toString())
            date.setText(assignment.date)
        }

        // Update button handler -> update the new assignment
        val updateButton = findViewById<Button>(R.id._updateButton)

        updateButton.setOnClickListener{
            // Get the fields from the new updated view
            val newTitle = findViewById<EditText>(R.id._updateTitle)
            val newCourse = findViewById<EditText>(R.id._updateCourse)
            val newNumber = findViewById<EditText>(R.id._updateNumber)
            val newMandatory = findViewById<CheckBox>(R.id._updateMandatory)
            val newProblemAssigned = findViewById<EditText>(R.id._updateProblem)
            val newDate = findViewById<EditText>(R.id._updateDate)

            val booleanMandatory = newMandatory.isChecked

            // Create the assignment from the edit texts
            val updatedAssignment = assignment?.id?.let { it1 ->
                    Assignment(
                        it1,
                        newTitle.text.toString(),
                        newCourse.text.toString(),
                        newNumber.text.toString().toInt(),
                        booleanMandatory,
                        newProblemAssigned.text.toString().toInt(),
                        newDate.text.toString()
                    )
            }

            // Update the assignment to the in-memory repository
            if (updatedAssignment != null) {
                // Get the repository from detail activity
                intent.getParcelableExtra<Repository>("Repo")?.updateAssignment(assignment.id, updatedAssignment)
            }

            // After updating the assignment, navigate to the main page
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
            finish()
        }
    }
}