using BMDS.Web.Services.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BMDS.Web.Services.ViewModels
{
    public class MemberViewModel
    {
        #region Properties
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public int Age { get; set; }
        public string Introduction { get; set; }
        public string ProfilePictureUrl { get; set; }
        #endregion
        #region constrs
        public MemberViewModel()
        {

        }
        public MemberViewModel(Member member)
        {

            if (member == null)
            {
                return;
            }
            Id = member.Id;
            FirstName = member.FirstName;
            LastName = member.LastName;
            MiddleName = member.MiddleName;
            Age = member.Age;
            Introduction = member.Introduction;
            ProfilePictureUrl = member.ProfilePictureUrl;

        }
        #endregion

        public Member ToMember()
        {
            return new Member
            {
                Id = Id,
                FirstName = FirstName,
                LastName = LastName,
                MiddleName = MiddleName,
                Age = Age,
                Introduction = Introduction,
                ProfilePictureUrl = ProfilePictureUrl
            };
        }

    }
}