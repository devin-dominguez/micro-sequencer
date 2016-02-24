# == Schema Information
#
# Table name: compositions
#
#  id          :integer          not null, primary key
#  title       :string           not null
#  user_id     :integer          not null
#  composition :text             not null
#  public      :boolean          default(TRUE)
#  original    :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class Composition < ActiveRecord::Base
  validates :title, :composition, :user_id, presence: true
  validates :public, inclusion: [true, false]

  belongs_to :user
end
