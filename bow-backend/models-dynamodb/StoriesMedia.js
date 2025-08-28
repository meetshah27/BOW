const { PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient, TABLES } = require('../config/dynamodb');
const { v4: uuidv4 } = require('uuid');

class StoriesMedia {
  constructor(data = {}) {
    this.id = data.id || 'stories-media-singleton'; // Single record for stories media
    this.mediaType = data.mediaType || 'image';
    this.mediaUrl = data.mediaUrl || '';
    this.thumbnailUrl = data.thumbnailUrl || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.altText = data.altText || '';
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.overlayOpacity = data.overlayOpacity !== undefined ? data.overlayOpacity : 0.2;
    this.storiesTitle = data.storiesTitle || 'Community Stories';
    this.storiesDescription = data.storiesDescription || 'Discover the inspiring journeys of individuals whose lives have been touched by Beats of Washington. Each story reflects the impact of our community and the power of coming together.';
    this.storiesSubtitle = data.storiesSubtitle || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Save stories media (create or update)
  async save() {
    try {
      this.updatedAt = new Date().toISOString();
      
      const command = new PutCommand({
        TableName: TABLES.STORIES_MEDIA,
        Item: this
      });

      await docClient.send(command);
      console.log('✅ Stories media saved successfully');
      return this;
    } catch (error) {
      console.error('❌ Error saving stories media:', error);
      throw error;
    }
  }

  // Get current stories media
  static async getCurrent() {
    try {
      const command = new GetCommand({
        TableName: TABLES.STORIES_MEDIA,
        Key: { id: 'stories-media-singleton' }
      });

      const result = await docClient.send(command);
      
      if (result.Item) {
        return new StoriesMedia(result.Item);
      } else {
        // Return default if no record exists
        return new StoriesMedia();
      }
    } catch (error) {
      console.error('❌ Error getting stories media:', error);
      // Return default on error
      return new StoriesMedia();
    }
  }

  // Update stories media
  static async update(updateData) {
    try {
      const current = await StoriesMedia.getCurrent();
      const updated = new StoriesMedia({
        ...current,
        ...updateData,
        updatedAt: new Date().toISOString()
      });

      return await updated.save();
    } catch (error) {
      console.error('❌ Error updating stories media:', error);
      throw error;
    }
  }

  // Reset to defaults
  static async reset() {
    try {
      const defaults = new StoriesMedia();
      return await defaults.save();
    } catch (error) {
      console.error('❌ Error resetting stories media:', error);
      throw error;
    }
  }

  // Delete stories media
  async delete() {
    try {
      const command = new DeleteCommand({
        TableName: TABLES.STORIES_MEDIA,
        Key: { id: this.id }
      });

      await docClient.send(command);
      console.log('✅ Stories media deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Error deleting stories media:', error);
      throw error;
    }
  }
}

module.exports = StoriesMedia;
