# VideoTagging Web Element
This web element can be used to tag videos, frame by frame. It is useful for video-processing applications, where computer vision algorithms are used on video input. For example, drones and robot applications are used to track a specific persn, to detect oil pipes leaks, etc.

Using the video-tagging web wlement, users can mark regions in each frame and associate text tags to these regions.

## Overview
The video-tagging web element is built using HTML5, CSS3 based on [Polymer](https://www.polymer-project.org/1.0/).
Here's an example of marking rectangualr regions in a frame and tagging them with textual labels, representing the objects within the region.
More details on the functionality apear below.

![Alt text](assets/images/area.png?raw=true "Title")

The area selection is credited to [ImageAreaSelect](http://odyniec.net/projects/imgareaselect/)

## Demo 
Follow the next steps to run the demo locally.

* You will need the following installations to be able to run the demo: <br>
  [node.js](https://nodejs.org/en/) <br>
  [Bower](http://bower.io/) <br>
  [Git client](http://www.git-scm.com/) or [GitHub app](https://desktop.github.com/)
* Clone the repository and install required packages

	```
	// clone the repository
	git clone https://github.com/CatalystCode/video-tagging.git
	```
	```
	// change dir to the 'demo'
	cd video-tagging
	```

	```
	// install required node.js packages
	npm install
	```

	```
	// install http-server to be able to host the demo
	npm install -g http-server
	```
	```
	// install bower components
	cd demo
	bower install
	```
	```
	// run a local http-server to host the demo
	http-server
	```
* Open your browser: [http://localhost:8080/index.html](http://localhost:8080/index.html)
* Select a tagging job from the list
* Use the mouse to mark a frame point/rectangle and use the tags toggles to select the relevant tags

 
## Using the element in your app
In order to use the element in your app, you need to install the video-tagging Bower component as follows:
 
```
 bower install CatalystCode/video-tagging
```

In your HTML page, add the element as follows:

* Add a reference to the element:

	```
	 <link rel="import" href="/bower_components/video-tagging/video-tagging.html">
	```

* Add the element tag inline:

	```
	<div style="width:65%">
		<video-tagging id='video-tagging'></video-tagging>
	</div>
	```


**A video-tagging web app, using this web element, is available here: [VideoTaggingTool](https://github.com/CatalystCode/VideoTaggingTool.git)**

##API & Usage

The video-tagging element is based on a video player, with additional functionality for tagging the frames. 
The **_tags_** are text labels associated to **_regions or points_** designated in each frame.
The regions that are currently supported are of type "Rectangle".

A **_video-tagging job_** is an input video and a configuration object which defines the tagging job.
Here's an example of a job configuration:
```
{ "id": 5,
  "video": "sample-video.mp4",
  "Description = "human tracking job",
  "regiontype":"Point", 
  "regionsize":"25", 
  "multiregions":"1", // allow multiple regions per frame
  "tage" : ["text-1","text-2","text-3"],
  "DurationSeconds" = 21.8, 
  "FramesPerSecond = 25,
  "Height" = 480,
  "Width" = 640
}
```

Each frame may have multiple region/point markers, each labeled with text tags.

**Example #1: Point markers** 
```
{ region: { name: 1, type: 'Point', x1: 123, y1: 54, tags: [ 'horse', 'brown'], ... }}
```

**Example #2: rectangle markers** 
```
{ region: { name: 1, type: 'Rectangle', x1: 123, y1: 54, x2: 35, y2: 78, tags: [ 'horse', 'brown'], ... }}
```


###Video Controls:  

![Alt text](assets/images/videocontrols.png?raw=true "Title")

1. Video timebar
2. Previous frame
3. Play/Pause
4. Next frame 
5. Skip to the furst untagged frame
6. Frame index
7. Play speed
8. Timer
9. Volume/Mute  

###Tagging controls    

![Alt text](assets/images/taggingcontrols.png?raw=true "Title")
  
1. Tags - click on the relevant buttons to tag the selected region/point in the frame.
2. Mark as empty frame - designates a frame with no relevant tags.
3. Lock tags - automatically adds selected tags to new regions. Toggle to enable/disable. 
     
      
###Tag the video  

**Point marker**<br>
click on the frame and associate tags to the clicked **point/position** in the frame. 
![Alt text](assets/images/singlepoint.png?raw=true "Title")

**Rectangle marker** 
Click on the frame, drag mouse to create a rectangle and release the mouse. Add tags using the tag toggles. 
![Alt text](assets/images/area.png?raw=true "Title")

To edit tags, select a marker (Point or Rectangle), and add/remove tags.

**Lock tags** 
When enabled, the selected tags will remain selected after tagging the current frame and moving to the next frame.
When only single marker can be tagged in a frame ("multitags="0") and the tags are locked, the frame will advance automatically after the marker was created.
In tsuch case, the tagging workflow is as follows:  
1. Create a new region - Click or drag  
2. Select tags  
3. Click on the Lock Icon   
4. Create a region   
5. Repeat   
6. Click the icon again to exit this mode.   


####Input Data     
The following properties must be populated:   

   * `videoduration` - number, for example 30.07  
   * `videowidth` - number, for example 420  
   * `videoheight` - number, for example 240  
   * `framerate` - number, for example 29.97  
   * `regiontype` - string, can be "point" or "rectangle"  
   * `regionsize` - number, for example 20 (in pixels) for point regions.  
   * `multitags` - string, can be "0" or "1"   
   * `inputtagsarray` - a string array of the possible tags
   * `inputFrames` - an object containing all the tagged frames of this video (That have been created at an earlier time).
      The object is a dictionary, the frame number is the key. Each frame has a collection of regions 
      and each region has a collection of tags.    
      In this example we see data for frames 434, 442 and 628.  
      ![Alt text](assets/images/frames1.png?raw=true "Title")  
      Expanded- each region is an object with coordinates and a tags array.  
      ![Alt text](assets/images/frames2.png?raw=true "Title")
  
Example:
```
var videotagging = document.getElementById('video-tagging');
		
videotagging.videoduration = data.video.DurationSeconds;
videotagging.videowidth = data.video.Width;
videotagging.videoheight = data.video.Height;
videotagging.framerate = data.video.FramesPerSecond;
```
      
Finally, to load the control, set the src property to the URL of the video: 
```
videotagging.src = data.video.Url;
```

####Output Data       
When a region is created or updated and when tags are added/removed, the element fires an event called "onregionchanged". Register to this event to get the
data:
```
document.getElementById('video-tegging').addEventListener('onregionchanged', function (e) {...
```
        
The control returns **all** the regions and their tags in the current frame. The parameter e holds this data in e.detail:  

![Alt text](assets/images/frames3.png?raw=true "Title")

####Browser Support  

![Alt text](assets/images/chrome.png?raw=true "Title")  Chrome 47   
![Alt text](assets/images/ff.png?raw=true "Title")      Firefox 43 

It is recommended to use the same browser consistently as there are differences between them regarding video time calculations.
Better precision was observed in Firefox.

# License
[MIT](LICENSE)
