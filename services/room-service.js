const RoomModel = require("../models/room-model");

class RoomService {
  async create(payload) {
    const { topic, roomType, ownerId } = payload;
    const room = await RoomModal.create({
      topic,
      roomType,
      ownerId,
      speakers: [ownerId],
    });
    return room;
  }
  async getAllRooms(types) {
    const rooms = await RoomModel.find({ roomType: { $in: types } })
      .populate("speakers")
      .populate("ownerId")
      .exec(); //The $in operator selects the documents where the value of a field equals any value in the specified array.
    return rooms;
  }
  async getRoom(roomId) {
    const room = await RoomModel.findOne({ _id: roomId });
    return room;
  }
}

module.exports = new RoomService();
