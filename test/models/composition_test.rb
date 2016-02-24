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

require 'test_helper'

class CompositionTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
