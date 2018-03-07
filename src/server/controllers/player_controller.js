'use strict';

class PlayerController
{
  // TODO: обязательно переделать с дефолтными значениями
  constructor(socket, options)
  {
    this.id = socket.id;

    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;

    this.radius = 50; // todo default from config
    this.mass = 100; // todo default from config
    this.hue = Math.round(Math.random() * 360);
    
    let _lastHeartbeat = new Date().getTime();
    this.updateLastHeartbreak = function() { _lastHeartbeat = new DateTime().getTime(); }
    this.getLastHeartbreak = function() { return _lastHeartbeat; }
  }

  MovePlayer()
  {
  
  }
  
  KickPlayer()
  {
  
  }
  
  KillPlayer()
  {
  
  }
}

exports.PlayerController = PlayerController;