"""Render documentation-only HTML; never import or launch the application."""
from pathlib import Path
import json
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[2]
OUT=Path(__file__).resolve().parent
logo='../../client/src/VitalCare.png'
header=f'<header class="manage-header book-header"><button class="main-button">Main</button><img class="logo" src="{logo}" alt="VitalCare"></header>'
rows=''.join(f'<div class="table-row"><div>{date}</div><div>{time}</div><div>Dr. Morgan</div><div>{kind}</div><div><button class="reschedule-btn">Reschedule</button><button class="filler-btn">_______</button><button class="cancel-btn">Cancel</button></div></div>' for date,time,kind in [('Monday, Jun 2, 2025','10:00 AM','Individual Therapy'),('Thursday, Jun 5, 2025','02:30 PM','Behavioral Therapy')])
manage=header+'<h2 class="manage-title">Manage Appointments</h2><p class="patient-name">Alex Taylor’s Appointments</p><div class="appointment-table"><div class="table-header"><div>Date</div><div>Time</div><div>Doctor</div><div>Concern</div><div>Actions</div></div>'+rows+'</div>'
book=header+'<h2 class="booking-title">Appointment Booking</h2><select class="dropdown"><option>Dr. Morgan</option></select><br><button class="view-reviews-btn">View Reviews for Dr. Morgan</button><p class="times-label">Available times:</p><div class="timeslot-list"><button class="slot-button">6/2/2025 - 10:00:00</button><button class="slot-button">6/5/2025 - 14:30:00</button><button class="slot-button">6/9/2025 - 11:00:00</button></div><div class="concern-area"><label>Select Type: </label><select><option>Individual Therapy</option></select></div><button class="confirm-btn">Confirm Appointment</button>'
blue='background:#0a3d91;color:white;padding:8px 12px;border:0;border-radius:4px'
cards=''.join(f'<article style="background:white;border-radius:8px;box-shadow:0 1px 3px #0002;margin-bottom:16px;overflow:hidden"><div style="background:#e9ecef;padding:12px 16px;font-weight:bold">{date}</div><div style="padding:12px 16px"><p><strong>Patient:</strong> Alex Taylor</p><p><strong>Type:</strong> Individual Therapy</p><p><strong>Status:</strong> {status}</p></div><div style="padding:12px 16px;display:flex;gap:8">'+''.join(f'<button style="{blue}">{label}</button>' for label in labels)+'</div></article>' for date,status,labels in [('6/2/2025, 10:00:00 AM','Scheduled',['Complete']),('5/26/2025, 10:00:00 AM','Completed',['Add Notes','View Notes'])])
dashboard=f'<header style="display:flex;align-items:center;justify-content:space-between;padding:16px 24px"><button style="{blue}">Set Availability</button><img src="{logo}" height="50" alt="VitalCare"><button style="{blue}">Log Out</button></header><h2 style="text-align:center;color:#0a3d91;margin:24px">Welcome, Dr. Morgan!</h2><nav style="display:flex;max-width:800px;margin:auto;border-bottom:1px solid #ccc">'+''.join(f'<button style="flex:1;padding:12px;border:0;background:{"#0a3d91" if i==0 else "transparent"};color:{"white" if i==0 else "#0a3d91"}">{s}</button>' for i,s in enumerate(['Show All','Scheduled','Completed','Cancelled']))+'</nav><div style="padding:24px;max-width:800px;margin:auto">'+cards+'</div>'
configs=[('appointments',manage,'ManageAppointments.css','manage-container'),('booking',book,'BookAppointment.css','book-container'),('therapist',dashboard,None,'dashboard')]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,channel='msedge')
    for name,body,css,klass in configs:
        style=(ROOT/'client/src/Styles'/css).read_text() if css else ''
        html='<!doctype html><html lang="en"><meta charset="utf-8"><title>VitalCare static preview</title><style>body{margin:0;font-family:Arial;background:#f8f9fc}.preview-label{padding:14px 24px;background:#17243e;color:white;font:12px Arial;letter-spacing:.4px}main{min-height:690px}'+style+'</style><div class="preview-label">STATIC UI PREVIEW · SAMPLE DATA · APPLICATION NOT RUN</div><main class="'+klass+'">'+body+'</main></html>'
        path=OUT/(name+'.html');path.write_text(html,encoding='utf-8')
        page=browser.new_page(viewport={'width':1200,'height':800},device_scale_factor=2)
        page.goto(path.as_uri());page.wait_for_function('Array.from(document.images).every(i=>i.complete&&i.naturalWidth>0)')
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        page.screenshot(path=str(OUT/(name+'.png')),full_page=True);page.close()
    browser.close()
print('Rendered three static documentation previews; no app or API started.')
