package com.example.nativelab.activities

import android.app.Activity
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.widget.CheckBox
import android.widget.EditText
import com.example.nativelab.R
import com.example.nativelab.model.Assignment
import com.example.nativelab.repository.Repository

class Add : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_add)

        // Get the repository from main activity
        val repo = intent.getParcelableExtra<Repository>("Repo")

        // Add button handler -> save the new assignment
        val saveButton = findViewById<Button>(R.id._saveButton)

        saveButton.setOnClickListener{
            // Get the fields from the user
            val title = findViewById<EditText>(R.id._title)
            val course = findViewById<EditText>(R.id._course)
            val number = findViewById<EditText>(R.id._number)
            val mandatory = findViewById<CheckBox>(R.id._mandatory)
            var booleanMandatory = false;
            if (mandatory.isChecked) {
                booleanMandatory = true;
            }
            val problemAssigned = findViewById<EditText>(R.id._problem)
            val date = findViewById<EditText>(R.id._date)

            // Create the assignment from the edit texts
            val assignment = repo?.getNextId()?.let { it1 ->
                Assignment(
                    it1,
                    title.text.toString(),
                    course.text.toString(),
                    number.text.toString().toInt(),
                    booleanMandatory,
                    problemAssigned.text.toString().toInt(),
                    date.text.toString()
                )
            }

            // Send the assignment and navigate to the main page
            val intent = Intent()
            intent.putExtra("NEW_ASSIGNMENT", assignment)
            setResult(Activity.RESULT_OK, intent)
            finish()
        }
    }
}