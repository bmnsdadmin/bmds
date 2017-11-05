using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BMDS.Web.Services.Models
{
    public class Member
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public int Age { get; set; }
        public string Introduction { get; set; }
        public string ProfilePictureUrl { get; set; }
    }
}