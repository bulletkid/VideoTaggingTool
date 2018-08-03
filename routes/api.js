var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var path = require('path');
var db = require('../storage/db');
var blob = require('../storage/blob');

module.exports = function () {

//    router.post('/logs', EditorLoggedIn, function (req, res) {
//        req.body.createdById = req.user.Id;
//        db.createOrModifyJob(req.body, function (err, result) {
//            if (err) return logError(err, res);
//            res.json(result);
//        });
//    });
 
    router.post('/jobs', AdminLoggedIn, function (req, res) {
        req.body.createdById = req.user.Id;
        db.createOrModifyJob(req.body, function (err, result) {
            if (err) return logError(err, res);
            res.json(result);
        });
    });
    
    router.post('/users', AdminLoggedIn, function (req, res) {
        db.createOrModifyUser(req.body, function (err, result) {
            if (err) return logError(err, res);
            res.json(result);
        });
    });
    
    router.post('/videos', AdminLoggedIn, function (req, res) {
        db.createOrModifyVideo(req.body, function (err, result) {
            if (err) return logError(err, res);
            res.json(result);
        });
    });
    
    router.post('/users', AdminLoggedIn, function (req, res) {
        db.createOrModifyUser(req.body, function (err, result) {
            if (err) return logError(err, res);
            res.json(result);
        });
    });
    
    router.get('/videos/:id/url', AdminLoggedIn, function (req, res) { 
      var id = req.params.id;
      console.log('getting url for blob', id);
      var url = blob.getVideoUrlWithSasWrite(id);
      return res.json({ url: url });
    });

		// DEBUG START
    router.get('/jobs/:id/framesOperations', EditorLoggedIn, function (req, res) { 
      var jobId = req.params.id;
      console.log('getting tags for job', jobId);
      db.getFrameTagsAndComments(jobId, function (err, resp) {
            if (err) return logError(err, res);
            res.json(resp);
        });
    });
		// DEBUG END

    router.get('/getUploadUrl/:video_id/:image_id', AdminLoggedIn, function (req, res) {
      var video_id = req.params.video_id;
      var image_id = req.params.image_id;
      console.log('getting upload url for blob', video_id, image_id);
      var url = blob.getVideoUrlWithSasWrite(video_id + "_" + image_id);
      return res.json({ url: url, image_name: image_id });
    });
    
    router.get('/videoFrames/:id', EditorLoggedIn, function (req, res) { 
        console.log('API.js: Getting video frames');

				// TODO: Debug why this isn't working
				//var token = db.getSASFromBlob();
        //console.log("Token is " +token);

        var id = req.params.id;
        db.getVideoFramesById(id, function (err, resp) {
            if (err) return logError(err, res);
            res.json(resp);
        });
    });

		// DEBUG START: Start code for fetching frame operations
    router.get('/frameOperations/:jobId/:frameIndex', EditorLoggedIn, function (req, res) { 
        console.log('API.js: Getting frame operations for job ' + req.params.jobId + " and frame index " + req.params.frameIndex);

				var jobId = req.params.jobId;
        var frameIndex = req.params.frameIndex;
        db.getFrameOperations(jobId, frameIndex, function (err, resp) {
            if (err) return logError(err, res);
            res.json(resp);
        });
    });
				// DEBUG END - End code for fetching frame operations

    router.post('/frameOperations/:jobId/:frameIndex/:comments', EditorLoggedIn, function (req, res) { 
				var jobId = req.params.jobId;
        var frameIndex = req.params.frameIndex;
        var comments = req.params.comments;
        console.log('Saving comment for ' + jobId + " and frameIndex " +frameIndex + " and comments are " + comments);
        db.updateFrameComments(jobId, frameIndex, comments, function (err, resp) {
            if (err) return logError(err, res);
            res.json(resp);
        });
    });

    router.post('/videos/:id', AdminLoggedIn, function (req, res) {
      var id = req.params.id;
      console.log('video uploaded', id);
        
      db.updateVideoUploaded({id: id}, function(err) {
          if (err) return logError(err, res);
          return res.json({ status: "OK" });
      });
    });

    // TODO: check job belong to editor / Admin mode, if Approved check user is Admin
    router.post('/jobs/:id/status', EditorLoggedIn, function (req, res) {
        var id = req.body.id = req.params.id;
        req.body.userId = req.user.Id;
        console.log('updating status for job', id);
        db.updateJobStatus(req.body, function (err, resp) {
            if (err) return logError(err, res);
            res.json(resp);
        });
    });

    router.get('/jobs/statuses', function (req, res) {
        console.log('getting jobs statuses');
        db.getJobstatuses(function (err, resp) {
            if (err) return logError(err, res);
            res.json(resp);
        });
    });
    
    router.get('/roles', function (req, res) {
        console.log('getting roles');
        db.getRoles(function (err, resp) {
            if (err) return res.status(500).json({ error: err });
            res.json(resp);
        });
    });
    
    // TODO: check job belong to editor / Admin mode
    router.get('/jobs/:id/frames', EditorLoggedIn, function (req, res) {
        var id = req.params.id;
        console.log('getting frames for job', id);
        db.getVideoFramesByJob(id, function (err, resp) {
            if (err) return logError(err, res);
            res.json(resp);
        });
    });

    // TODO: check job belong to editor / Admin mode
    router.get('/jobs/:id', EditorLoggedIn, function (req, res) {
        var id = req.params.id;
        console.log('getting job id', id);
        db.getJobDetails(id, function (err, resp) {
            if (err) return logError(err, res);
            res.json(resp);
        });
    });
    
    router.get('/jobs', AdminLoggedIn, function (req, res) {
        console.log('getting all jobs');
        db.getAllJobs(function (err, resp) {
            if (err) return logError(err, res);
            res.json(resp);
        });
    });
    
    // TODO: check job belong to editor / Admin mode
    router.post('/jobs/:id/frames/:index', EditorLoggedIn, function (req, res) {
        var options = {
            tagsJson: req.body.tags
        };
        options.jobId = req.params.id;
        options.frameIndex = req.params.index;
        
        console.log('posing frame index', options.frameIndex, 'for job', options.jobId);
        db.createOrModifyFrame(options, function (err) {
            if (err) return logError(err, res);
            res.json({});
        });
    });
    
    router.get('/users/:id/jobs', [EditorLoggedIn, AuthorizeUserAction], function (req, res) {
        var userId = req.user.Id;
        console.log('getting jobs for user id', userId);
        db.getUserJobs(userId, function (err, resp) {
            if (err) return logError(err, res);
            res.json(resp);
        });
    });
    
    router.get('/videos', AdminLoggedIn, function (req, res) {
        var labels = [];
        var filter = req.query.filter;
        var unassigned = req.query.unassigned == '1' ? 1 : 0;
        if (filter) {
            var labels = filter.split(',');
            console.log('getting videos labeled ' + labels);
        }

        return db.getVideos({
                labels: labels,
                unassigned: unassigned
            },
            function (err, resp) {
                if (err) return res.status(500).json({ error: err });
                console.log('resp:', resp);
                res.json(resp);
        });
    });
    
    router.get('/videos/:id', EditorLoggedIn, function (req, res) {
        var id = req.params.id;
        console.log('getting video', id);
        db.getVideo(id, function (err, resp) {
            if (err) return logError(err, res);
            res.json(resp);
        });
    });

    // Not in use- can be used to stream the movie through the API if we
    // want to force authentication & authorization
    router.get('/videos/:id/movie', EditorLoggedIn, function (req, res) {
        var id = req.params.id;
        console.log('getting video file', id);
        
        return blob.getVideoStream({ name: id }, function (err, result) {
            if (err) return logError(err, res);
            
            console.log('stream', result);
            
            res.setHeader('content-type', result.contentType);
            res.setHeader('content-length', result.contentLength);
            res.setHeader('etag', result.etag);
            
            result.stream.on('error', function (err) {
                console.error(err);
                return res.status(500).json({ message: err.message });
            });
            
            result.stream.pipe(res);
        });
    });
    
    router.get('/users/:id', AdminLoggedIn, function (req, res) {
        var id = req.params.id;
        console.log('getting user', id);
        db.getUserById(id, function (err, resp) {
            if (err) return logError(err, res);
            res.json(resp);
        });
    });

    router.get('/users', AdminLoggedIn, function (req, res) {
        console.log('getting users');
        db.getUsers(function (err, resp) {
            if (err) return logError(err, res);
            res.json(resp);
        });
    });
    
    router.get('/videos/:id/frames', EditorLoggedIn, function (req, res) {
        var id = req.params.id;
        console.log('getting frames for video', id);
        db.getVideo(id, function (err, video) {
            if (err) return logError(err, res);
            db.getVideoFrames(id, function (err, resp) {
                if (err) return logError(err, res);
                res.setHeader("Content-Type", "application/json");
                res.setHeader("Content-Disposition", "attachment;filename=" + video.Name + ".tags.json");
                res.setHeader("Content-Transfer-Encoding", "utf-8");
                res.json(resp);
            });
        });
    });

    router.get('/labels', AdminLoggedIn, function (req, res) {
        console.log('getting all labels');
        db.getLabels(function (err, resp) {
            if (err) return res.status(500).json({ error: err });
            res.json(resp);
        });
    });

    return router;
}

function logError(err, res) {
    console.error('error:', err);
    return res.status(500).json({ message: err.message });
}

var AdminLoggedIn = getLoggedInForRole(['Admin']);
var EditorLoggedIn = getLoggedInForRole(['Admin', 'Editor']);

function AuthorizeUserAction(req, res, next) {
    var id = req.params.id;
    if (id && req.user.RoleName === 'Editor' && req.user.Id != id) {
            return res.status(401).json({ error: 'user is not an Admin, can\'t access other user data' });
    }
    return next();
}

function getLoggedInForRole(roles) {
    return function(req, res, next) {
        
        // if user is authenticated in the session, and in role
        if (!req.isAuthenticated())
            return res.status(401).json({ error: 'user not logged in' });
        
        var found = false;
        for (var i = 0; i < roles.length; i++)
            if (req.user.RoleName === roles[i]) {
                found = true;
                break;
            }

        if (!found)
            return res.status(401).json({ error: 'user not in ' + JSON.stringify(roles) + ' role' });
        
        return next();
    }   
}
