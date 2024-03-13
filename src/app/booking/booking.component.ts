import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var createGoogleEvent: any;
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
})
export class BookingComponent implements OnInit {
  constructor(private fb: FormBuilder,private http: HttpClient) {}
  appointmentForm!: FormGroup;

  ngOnInit() {
    this.appointmentForm = this.fb.group({
      appointmentTime: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // Function to handle the button click event to schedule a meeting.
  scheduleMeeting() {
  

    const attendees = ['aananth11111@gmail.com','agilexacs@gmail.com','developer@agilecyber.com']
    attendees.push(this.appointmentForm.value.email);
    console.log("attendees",attendees)
    let appointmentTime = new Date(this.appointmentForm.value.appointmentTime);
    // Convert the date to the desired format with a custom offset (e.g., -07:00)
    const startTime = appointmentTime.toISOString().slice(0, 18) + '-07:00';
    const endTime = this.getEndTime(appointmentTime);
    const eventDetails = {
      email: this.appointmentForm.value.email,
      startTime: startTime,
      endTime: endTime,
    };
 
    console.info(eventDetails);
    //this.generateICSFile()
    createGoogleEvent(eventDetails);
  
  let storedTimes = JSON.parse(localStorage.getItem('storedTimes') || '[]') as string[];
  console.log('storedTimes',storedTimes);
  
  if (storedTimes.includes(startTime)) {
      alert("Scheduled time already exists. Please choose another time interval.");
      return;
  }else{
  storedTimes.push(startTime);
  localStorage.setItem('storedTimes', JSON.stringify(storedTimes));
}
  }

  getEndTime(appointmentTime: Date) {
    // Add one hour to the date
    appointmentTime.setHours(appointmentTime.getHours() + 1);
    const endTime = appointmentTime.toISOString().slice(0, 18) + '-07:00';
    return endTime;
  }

  generateICSFile() {
    const datetimeValue = this.appointmentForm.value.appointmentTime;
    const date = new Date(datetimeValue);
    const endTime = new Date(date);
    endTime.setHours(endTime.getHours() + 1);
    // Format dates to be in the proper format for the .ics file
    const formattedStartDate = date
      .toISOString()
      .replace(/-/g, '')
      .replace(/:/g, '')
      .slice(0, -5);
    const formattedEndDate = endTime
      .toISOString()
      .replace(/-/g, '')
      .replace(/:/g, '')
      .slice(0, -5);
    // Event details
    const eventName = 'Sample Event';
    const eventDescription = 'This is a sample event';
    const location = 'Sample Location';
    // Create the .ics content
    const icsContent = `BEGIN:VCALENDAR
  VERSION:2.0
  BEGIN:VEVENT
  DTSTAMP:${formattedStartDate}Z
  DTSTART:${formattedStartDate}Z
  DTEND:${formattedEndDate}Z
  SUMMARY:${eventName}
  DESCRIPTION:${eventDescription}
  LOCATION:${location}
  END:VEVENT
  END:VCALENDAR`;
    // Create a Blob containing the .ics content
    const blob = new Blob([icsContent], {
      type: 'text/calendar;charset=utf-8',
    });
    // Create a download link for the Blob
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'event.ics';
    // Trigger the download
    downloadLink.click();
  }
}