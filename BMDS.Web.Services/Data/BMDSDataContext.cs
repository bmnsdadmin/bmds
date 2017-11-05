using BMDS.Web.Services.Models;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace BMDS.Web.Services.Data
{
    public class BMDSDataContext: IdentityDbContext
    {
        public DbSet<Member> Members { get; set; }
    }
}